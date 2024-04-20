import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { InsertMessage } from '../types/helpers.types'

export const useUpdateMessagesMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ message_id, text, chat_id }: { message_id: number; text: string; chat_id: string }) => {
            queryClient.setQueryData<InsertMessage[]>(['messages', chat_id], (oldMessages) =>
                //TODO
                (oldMessages || []).map((message) =>
                    message.id === message_id ? { ...message, text: text } : message,
                ),
            )
            const { data, error } = await supabase
                .from('messages')
                .update({ text: text })
                .eq('id', message_id)
                .select()
                .single()
            if (error) throw error
            return data
        },
        onError: (_, { chat_id }) => {
            return queryClient.invalidateQueries({ queryKey: ['messages', chat_id] })
        },
    })
}
