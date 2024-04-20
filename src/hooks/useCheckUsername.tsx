import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import useSession from './useSession'

export const useCheckUsername = (username: string) => {
    const { profile } = useSession()
    return useQuery({
        queryKey: ['usernames', username] as const,
        queryFn: async ({ queryKey }) => {
            const [, query] = queryKey
            if (query === profile?.username || query === '') return true
            else {
                const { data, error } = await supabase.from('profiles').select('*').eq('username', query)
                if (error) throw error
                return data.length === 0
            }
        },
    })
}
