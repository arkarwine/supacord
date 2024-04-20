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
            const { data, error } = await supabase.rpc('delete_message', { message_id: message_id, chat_id: chat_id })
            console.log(data)
            if (error) throw error
            return data
        },
        onError: (_, { chat_id }) => {
            return queryClient.invalidateQueries({ queryKey: ['messages', chat_id] })
        },
    })
}
