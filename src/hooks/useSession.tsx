import { useContext } from 'react'
import { SessionContext, SessionState } from '../providers/session.tsx'

export default function useSession(): SessionState {
    return useContext(SessionContext)
}
