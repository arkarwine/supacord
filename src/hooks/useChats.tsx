import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { Chat } from '../routes/root/chat'

export const useChats = () =>
    useQuery({
        queryKey: ['chats'] as const,
        queryFn: async (): Promise<Chat[]> => {
            const res =
                (await supabase.from('get_chats').select()).data?.map(
                    (chat): Chat => ({
                        id: chat.id,
                        user: chat.user || undefined,
                        state: 'present',
                    }),
                ) || []
            return res
        },
    })
