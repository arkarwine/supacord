import { useContext } from 'react'
import { PresenceContext } from '../providers/realtime'

export const usePresence = () => useContext(PresenceContext)
