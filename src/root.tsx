import { Outlet } from 'react-router-dom'
import useSession from './hooks/useSession'
import ToastProvider from './providers/toast'

type Props = {}

function Root({}: Props) {
    const { session, profile } = useSession()
    const isLoading = session === undefined || profile === undefined

    if (isLoading) {
        return (
            <div className="flex center h-full">
                <div className="w-5 h-5 rounded-full bg-sky-300 animate-ping"></div>
            </div>
        )
    }
    return (
        <ToastProvider>
            <Outlet />
        </ToastProvider>
    )
}

export default Root
