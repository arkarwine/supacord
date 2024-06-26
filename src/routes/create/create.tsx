import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Button from '../../components/button'
import Input from '../../components/input'
import { useCheckUsername } from '../../hooks/useCheckUsername'
import useSession from '../../hooks/useSession'
import supabase from '../../lib/supabase'

type Props = {}

function Create({}: Props) {
    const { session, profile, updateProfile } = useSession()

    if (!session) return <Navigate to="/login" />
    if (profile) return <Navigate to=".." />

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastname] = useState('')
    const [username, setUsername] = useState('')

    const { data: usernameIsAvailable, isFetching } = useCheckUsername(username)
    const usernameIsValid = !/[^a-zA-Z1-9_]/g.test(username)

    const [stage, setStage] = useState(0)

    const before = 'pointer-events-none -md:translate-x-[100vw] md:translate-x-40 md:opacity-0 pointer' // translate right
    const after = 'pointer-events-none -md:translate-x-[-100vw] md:-translate-x-40 md:opacity-0' // translate left

    return (
        <div className="overflow-x-hidden overflow-y-auto h-full">
            <main className=" relative min-h-[512px] h-full flex center bg-primary min-w-[300px]">
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
                    <Input
                        maxLength={32}
                        value={firstName}
                        className="mt-10"
                        placeholder="First Name"
                        disabled={stage !== 0}
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        maxLength={32}
                        value={lastName}
                        className="mt-4"
                        placeholder="Last Name"
                        disabled={stage !== 0}
                        onChange={(e) => setLastname(e.target.value)}
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
                                first_name: firstName,
                                last_name: lastName,
                                username: username,
                            })
                            .select()
                            .then((e) => updateProfile(e.data![0]))
                    }}
                >
                    <h1 className="text-3xl font-semi-bold tracking-tight text-slate-600">Your Username</h1>
                    <p className="mt-1 text-sm text-slate-400">Please enter your username</p>
                    <Input
                        maxLength={32}
                        value={username}
                        pattern="[a-zA-Z0-9_]{2,32}"
                        className="mt-10 mb-2"
                        placeholder="Username"
                        disabled={stage !== 1}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <p
                        className={`transition-all text-xs ${
                            isFetching
                                ? 'text-slate-600'
                                : usernameIsAvailable && username !== ''
                                  ? 'text-green-500'
                                  : 'text-red-500'
                        }`}
                    >
                        {username === ''
                            ? 'This field is required'
                            : isFetching
                              ? 'Loading...'
                              : usernameIsAvailable
                                ? 'This username is available'
                                : 'This username is not available'}
                    </p>
                    <p
                        className={`transition-all text-xs ${username !== '' && usernameIsValid ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {username === ''
                            ? 'Username cannot be empty'
                            : usernameIsValid
                              ? 'Username is valid'
                              : 'Username cannot contain special characters'}
                    </p>
                    <Button className="mt-4" disabled={stage !== 1 || !usernameIsAvailable || !usernameIsValid}>
                        Next
                    </Button>
                </form>
            </main>
        </div>
    )
}

export default Create
