import { Navigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import supabase from '../../lib/supabase'

function signIn(): void {
    supabase.auth.signInWithOAuth({
        options: {
            redirectTo: `${import.meta.env.VITE_VERCEL_ENV === 'production' ? import.meta.env.VITE_PROD_URL : import.meta.env.VITE_VERCEL_ENV === 'preview' ? import.meta.env.VITE_VERCEL_URL : 'http://localhost:8898'}`,
        },
        provider: 'google',
    })
}

function Login() {
    const { session } = useSession()
    if (session) return <Navigate to=".." />

    return (
        <main className="flex h-full justify-center items-center overflow-hidden">
            <div className="flex h-full w-full justify-center items-center rounded-lg shadow-[0_0_6px_-1px_rgb(0_0_0/0.1)] sm:h-3/5 sm:w-3/5 md:h-5/6 md:w-2/5 lg:w-[35%] xl:w-[30%]">
                <button
                    onClick={signIn}
                    className="flex flex-row justify-center items-center rounded-full border-[1px] border-[#747775] bg-white px-3 py-2.5 text-[#1F1F1F] hover:bg-[#F2F2F2]"
                >
                    <div className="flex justify-center items-center pr-2.5">
                        {/* Google G Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            className="h-5 w-5"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                    </div>
                    <p>Continue with Google</p>
                </button>
            </div>
        </main>
    )
}

export default Login
