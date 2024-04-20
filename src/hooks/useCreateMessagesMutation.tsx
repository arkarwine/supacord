import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { InsertMessage } from '../types/helpers.types'

export const useCreateMessagesMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (newMessages: InsertMessage[]) => {
            const { data, error } = await supabase.from('messages').insert(newMessages).select()
            if (error) throw error
            return data || []
        },
        onSuccess: (newMessages: InsertMessage[]) => {
            const chat_id = newMessages[0].chat_id
            queryClient.setQueryData<InsertMessage[]>(['messages', chat_id], (oldMessages) => [
                ...(oldMessages || []),
                ...newMessages,
            ])
        },
        onError: (_, [{ chat_id }]) => {
            return queryClient.invalidateQueries({ queryKey: ['messages', chat_id] })
        },
    })
}
