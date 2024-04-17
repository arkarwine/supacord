import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'

export const useMessages = (chat_id: string) =>
    useQuery({
        queryKey: ['messages', chat_id] as const,
        queryFn: async ({ queryKey }) => {
            const [, chat_id] = queryKey
            if (chat_id === '') return []
            return (await supabase.rpc('get_messages', { chat_id: chat_id })).data
        },
    })
