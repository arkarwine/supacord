import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'

type options = {
    queryKey: string[]
    signal: AbortSignal
    meta: Record<string, unknown> | undefined
}

export const useSearchProfiles = (search: string) => {
    return useQuery({
        queryKey: ['searchChats', search] as const,
        queryFn: async ({ queryKey }: options) => {
            const [, query] = queryKey
            if (query === '') return []
            const { data, error } = await supabase
                .from('profiles')
                .select()
                .ilike('username', query.replace(' ', '') + '%')
            if (error) throw error
            return data || []
        },
        gcTime: 60000,
    })
}
