import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import supabase from '../lib/supabase'
import { Chat } from '../routes/root/chat'
import { Message } from '../types/helpers.types'
import useSession from './useSession'

export const useSubscribeMessages = () => {
    const queryClient = useQueryClient()
    const { session } = useSession()
    return useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on<Message>(
                'postgres_changes',
                {
                    event: 'INSERT', // Listen only to INSERTs
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    if (
                        payload.new.sender_id !== session!.user.id &&
                        queryClient.getQueryData<Message[]>(['messages', payload.new.chat_id]) !== undefined
                    ) {
                        queryClient.setQueryData<Message[]>(['messages', payload.new.chat_id], (oldMessages) => [
                            ...(oldMessages || []),
                            payload.new as Message,
                        ])
                    }
                    queryClient.setQueryData<Chat[]>(['chats'], (chats) =>
                        (chats || []).map((chat) =>
                            chat.id === payload.new.chat_id
                                ? {
                                      ...chat,
                                      last_message: payload.new,
                                  }
                                : chat,
                        ),
                    )
                    queryClient.invalidateQueries({ queryKey: ['chats'] })
                },
            )
            .on<Message>(
                'postgres_changes',
                {
                    event: 'UPDATE', // Listen only to UPDATEs
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    console.log(payload.new)
                    if (payload.new.deleted === true) {
                        queryClient.setQueryData<Message[]>(['messages', payload.new.chat_id], (oldMessages) =>
                            (oldMessages || []).filter((message) => message.id !== payload.new.id),
                        )
                    } else {
                        queryClient.setQueryData<Message[]>(['messages', payload.new.chat_id], (oldMessages) =>
                            //TODO: Error
                            oldMessages?.map((message) => (message.id === payload.new?.id ? payload.new! : message)),
                        )
                    }
                    queryClient.invalidateQueries({ queryKey: ['chats'] })
                },
            )
            .subscribe()
        const unsubscribe = async () => {
            await channel.unsubscribe()
        }
        return () => {
            unsubscribe()
        }
    }, [])
}
