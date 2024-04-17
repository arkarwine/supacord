import { Navigate, createBrowserRouter } from 'react-router-dom'
import PresenceProvider from './providers/realtime'
import Root from './root'
import Create from './routes/create'
import Login from './routes/login'
import Chat from './routes/root'

const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                index: true,
                element: <Navigate to="/chat" />,
            },
            {
                path: '/chat/*',
                element: (
                    <PresenceProvider>
                        <Chat />
                    </PresenceProvider>
                ),
            },
            {
                path: '/create',
                element: <Create />,
            },
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
])

export default AppRouter
