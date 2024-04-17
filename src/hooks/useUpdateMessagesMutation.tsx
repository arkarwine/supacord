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
            return (await supabase.from('messages').update({ text: text }).eq('id', message_id).select().single()).data
        },
    })
}
