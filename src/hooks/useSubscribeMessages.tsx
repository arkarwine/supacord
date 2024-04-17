import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import supabase from '../lib/supabase'
import { InsertMessage } from '../types/helpers.types'
import useSession from './useSession'

export const useSubscribeMessages = () => {
    const queryClient = useQueryClient()
    const { session } = useSession()
    return useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on<InsertMessage>(
                'postgres_changes',
                {
                    event: 'INSERT', // Listen only to INSERTs
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    if (payload.new.start) {
                        queryClient.invalidateQueries({ queryKey: ['chats'] })
                    }
                    if (
                        payload.new.sender_id !== session!.user.id &&
                        queryClient.getQueryData<InsertMessage[]>(['messages', payload.new.chat_id]) !== undefined
                    ) {
                        queryClient.setQueryData<InsertMessage[]>(['messages', payload.new.chat_id], (oldMessages) => [
                            ...(oldMessages || []),
                            payload.new as InsertMessage,
                        ])
                    }
                },
            )
            .on<InsertMessage>(
                'postgres_changes',
                {
                    event: 'UPDATE', // Listen only to DELETEs
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    if (payload.new.deleted === true) {
                        queryClient.setQueryData<InsertMessage[]>(['messages', payload.new.chat_id], (oldMessages) =>
                            (oldMessages || []).filter((message) => message.id !== payload.new.id),
                        )
                    } else {
                        queryClient.setQueryData<InsertMessage[]>(['messages', payload.new.chat_id], (oldMessages) =>
                            //TODO: Error
                            oldMessages?.map((message) => (message.id === payload.new?.id ? payload.new! : message)),
                        )
                    }
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
