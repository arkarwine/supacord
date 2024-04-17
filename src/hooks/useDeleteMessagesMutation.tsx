import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { Message } from '../types/helpers.types'

export const useDeleteMessagesMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ message_id, chat_id }: { message_id: number; chat_id: string }) => {
            queryClient.setQueryData<Message[]>(['messages', chat_id], (oldMessages) =>
                oldMessages?.filter((message) => message.id !== message_id),
            )
            return await supabase.rpc('delete_message', { message_id: message_id, chat_id: chat_id })
        },
    })
}
