import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './app'
import { useToasts } from './hooks/useToasts'
import './index.css'
import SessionProvider from './providers/session'
import ThemeProvider from './providers/theme'
import ToastProvider from './providers/toast'

const App = () => {
    const showToast = useToasts()
    const onError = (e: Error) => {
        if (import.meta.env.DEV) {
            console.error(e)
        }
        showToast!({
            text: 'An error occured!',
            type: 'error',
        })
    }
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 0,
                staleTime: Infinity,
                gcTime: Infinity,
                refetchOnWindowFocus: false,
            },
        },
        queryCache: new QueryCache({
            onError,
        }),
        mutationCache: new MutationCache({
            onError,
        }),
    })
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <RouterProvider router={AppRouter}></RouterProvider>
            </SessionProvider>
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    )
}

const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <ThemeProvider>
            <ToastProvider>
                <App></App>
            </ToastProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
