import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'
import { createContext, useEffect, useReducer, useRef, useState } from 'react'
import useSession from '../hooks/useSession'
import supabase from '../lib/supabase'

export type PresenceState = {
    typing: string | null
}

export type PresenceContextType = {
    channel: RealtimeChannel | null
    presenceState: RealtimePresenceState<PresenceState>
}

export const PresenceContext = createContext<PresenceContextType | null>(null)

function PresenceProvider({ children }: React.PropsWithChildren) {
    const [, forceUpdate] = useReducer((x) => x + 1, 0)
    const { session } = useSession()
    const channel = useRef<RealtimeChannel | null>(null)
    const [presenceState, setPresenceState] = useState<RealtimePresenceState<PresenceState>>(() => ({}))
    useEffect(() => {
        const _channel = supabase.channel('public', {
            config: {
                presence: {
                    key: session?.user.id,
                },
            },
        })

        _channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.current?.presenceState<PresenceState>()
                forceUpdate()
                setPresenceState(newState || {})
            })
            .subscribe()
            .track({
                typing: null,
            })

        channel.current = _channel
        async function unsubscribe() {
            await _channel.unsubscribe()
        }

        return () => {
            unsubscribe()
        }
    }, [])
    return (
        <PresenceContext.Provider value={{ channel: channel.current, presenceState }}>
            {children}
        </PresenceContext.Provider>
    )
}

export default PresenceProvider
