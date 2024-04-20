import { Session } from '@supabase/supabase-js'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { createContext, useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { Profile } from '../types/helpers.types'

export interface SessionState {
    session?: Session | null
    profile?: Profile | null
    updateProfile: UseMutateFunction<UpdateProfile[], Error, UpdateProfile, unknown>
}

export type UpdateProfile = Partial<Profile>

export const SessionContext = createContext<SessionState>({} as SessionState)

export default function SessionProvider({ children }: React.PropsWithChildren) {
    // WARN: make sure "isLoading" is set to false ONLY when session and profile have been retrived!

    const [session, setSession] = useState<Session | null | undefined>()
    const { data: profile } = useQuery<Profile | null>({
        queryKey: ['profile', session?.user.id] as const,
        queryFn: async ({ queryKey }) => {
            const [, user_id] = queryKey
            if (!user_id) return null
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user_id)
            if (error) throw error
            return data.at(-1) || null
        },
    })
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async (updated_profile: UpdateProfile) => {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updated_profile,
                })
                .eq('id', session!.user.id)
                .select()
            if (error) throw error
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session))

        const {
            data: {
                subscription: { unsubscribe },
            },
        } = supabase.auth.onAuthStateChange((_, new_session) => setSession(new_session))

        return () => unsubscribe()
    }, [])

    return (
        <SessionContext.Provider
            value={{
                session,
                profile,
                updateProfile: mutate,
            }}
        >
            {children}
        </SessionContext.Provider>
    )
}
