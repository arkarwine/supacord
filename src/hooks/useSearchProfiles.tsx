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
            return (
                (
                    await supabase
                        .from('profiles')
                        .select()
                        .ilike('username', query.replace(' ', '') + '%')
                ).data || []
            )
        },
        gcTime: 60000,
    })
}
