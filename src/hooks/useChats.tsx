import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { Chat } from '../routes/root/chat'

export const useChats = () =>
    useQuery({
        queryKey: ['chats'] as const,
        queryFn: async (): Promise<Chat[]> => {
            const { data, error } = await supabase.from('get_chats').select()
            if (error) throw error

            return (
                data?.map(
                    (chat): Chat => ({
                        id: chat.id,
                        user: chat.user,
                        state: 'present',
                        last_message: chat.last_message,
                    }),
                ) || []
            )
        },
    })
