import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { InsertMessage } from '../types/helpers.types'

export const useCreateMessagesMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (newMessages: InsertMessage[]) =>
            (await supabase.from('messages').insert(newMessages).select()).data || [],
        onSuccess: (newMessages: InsertMessage[]) => {
            const chat_id = newMessages[0].chat_id
            queryClient.setQueryData<InsertMessage[]>(['messages', chat_id], (oldMessages) => [
                ...(oldMessages || []),
                ...newMessages,
            ])
        },
    })
}
