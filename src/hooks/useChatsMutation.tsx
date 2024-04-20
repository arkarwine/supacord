import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { Chat } from '../routes/root/chat'
import { Profile } from '../types/helpers.types'

export const useChatsMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (receiver_user: Profile): Promise<Chat> => {
            // TODO: Error
            const { data, error } = await supabase.rpc('create_private_chat', { receiver_user_id: receiver_user.id })
            if (error) throw error
            return {
                id: data?.id!,
                user: receiver_user,
                state: 'present',
                last_message: null,
            }
        },
        onSuccess: (chat: Chat) => {
            queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => [...(oldChats || []), chat])
        },
        onError: () => {
            return queryClient.invalidateQueries({ queryKey: ['chats'] })
        },
    })
}
