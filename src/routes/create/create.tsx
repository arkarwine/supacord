import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Button from '../../components/button'
import Form from '../../components/form'
import useSession from '../../hooks/useSession'
import supabase from '../../lib/supabase'

type Props = {}

function Create({}: Props) {
    const { session, profile, updateProfile } = useSession()

    if (!session) return <Navigate to="/login" />
    if (profile) return <Navigate to=".." />

    const firstName = useRef('')
    const lastName = useRef('')
    const username = useRef('')

    const [stage, setStage] = useState(0)

    const before = 'pointer-events-none -md:translate-x-[100vw] md:translate-x-40 md:opacity-0 pointer' // translate right
    const after = 'pointer-events-none -md:translate-x-[-100vw] md:-translate-x-40 md:opacity-0' // translate left

    return (
        <div className="overflow-x-hidden overflow-y-auto h-full">
            <main className=" relative min-h-[512px] h-full flex center bg-gradient-to-tr from-blue-50 via-white to-cyan-50 min-w-[300px]">
                {/* Name form */}
                <form
                    className={`absolute transition-all duration-300 ease-out max-w-80 w-full pt-20 h-full flex flex-col px-3 text-center ${stage === 0 ? '' : after}`}
                    onSubmit={(e) => {
                        e.preventDefault()
                        setStage(1)
                    }}
                >
                    <h1 className="text-3xl font-semi-bold tracking-tight text-slate-600">Your Name</h1>
                    <p className="mt-1 text-sm text-slate-400">Please enter your name</p>
                    <Form
                        className="mt-10"
                        placeholder="First Name"
                        disabled={stage !== 0}
                        required
                        onChange={(e) => (firstName.current = e.target.value)}
                    />
                    <Form
                        className="mt-4"
                        placeholder="Last Name"
                        disabled={stage !== 0}
                        onChange={(e) => (lastName.current = e.target.value)}
                    />
                    <Button className="mt-4" disabled={stage !== 0}>
                        Next
                    </Button>
                </form>
                {/* Username form */}
                <form
                    className={`absolute transition-all duration-300 ease-in-out max-w-80 w-full pt-20 h-full flex flex-col px-3 text-center ${stage === 1 ? '' : stage > 1 ? after : before}`}
                    onSubmit={(e) => {
                        e.preventDefault()
                        setStage(2)
                        supabase
                            .from('profiles')
                            .insert({
                                first_name: firstName.current,
                                last_name: lastName.current,
                                username: username.current,
                            })
                            .select()
                            .then((e) => updateProfile(e.data![0]))
                    }}
                >
                    <h1 className="text-3xl font-semi-bold tracking-tight text-slate-600">Your Username</h1>
                    <p className="mt-1 text-sm text-slate-400">Please enter your username</p>
                    <Form
                        className="mt-10"
                        placeholder="Username"
                        disabled={stage !== 1}
                        required
                        onChange={(e) => (username.current = e.target.value)}
                    />
                    <Button className="mt-4" disabled={stage !== 1}>
                        Next
                    </Button>
                </form>
            </main>
        </div>
    )
}

export default Create
