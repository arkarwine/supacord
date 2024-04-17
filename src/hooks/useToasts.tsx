import { useContext } from 'react'
import { ToastContext } from '../providers/toast'

export const useToasts = () => useContext(ToastContext)
