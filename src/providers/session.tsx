import { PostgrestSingleResponse, Session } from '@supabase/supabase-js'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { createContext, useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { Profile } from '../types/helpers.types'

export interface SessionState {
    session?: Session | null
    profile?: Profile | null
    updateProfile: UseMutateFunction<PostgrestSingleResponse<UpdateProfile>, Error, UpdateProfile, unknown>
}

export type UpdateProfile = Pick<Profile, 'first_name' | 'last_name' | 'username'>

export const SessionContext = createContext<SessionState>({} as SessionState)

export default function SessionProvider({ children }: React.PropsWithChildren) {
    // WARN: make sure "isLoading" is set to false ONLY when session and profile have been retrived!

    const [session, setSession] = useState<Session | null | undefined>()
    const { data: profile } = useQuery<Profile | null>({
        queryKey: ['profile', session?.user.id] as const,
        queryFn: async ({ queryKey }) => {
            const [, user_id] = queryKey
            if (!user_id) return null
            return (await supabase.from('profiles').select('*').eq('id', user_id)).data?.at(0) || null
        },
    })
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async ({ first_name, username, last_name }: UpdateProfile) =>
            await supabase
                .from('profiles')
                .update({
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                })
                .eq('id', session!.user.id)
                .select()
                .single(),
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
