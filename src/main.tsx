import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './app'
import './index.css'
import SessionProvider from './providers/session'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: Infinity,
            gcTime: Infinity,
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <RouterProvider router={AppRouter}></RouterProvider>
            </SessionProvider>
            {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
    </React.StrictMode>,
)
