import React, { useContext } from 'react'
import { PresenceContext } from '../providers/realtime'
import { Profile } from '../routes/root/chat'
import Avatar from './avatar'
import BackButton from './backButton'

type Props = {
    backButtonOnClick: React.MouseEventHandler<HTMLButtonElement>
    user: Profile
}

function Header({ backButtonOnClick, user }: Props) {
    const presence = useContext(PresenceContext)
    const presenceState = presence?.presenceState || {}
    const onlineUsers = Object.keys(presenceState || [])
    const typingUsers = onlineUsers.filter((id) => presenceState[id][0].typing !== null)
    return (
        <section className="grow-0 shrink-0 absolute h-16 border-b-2 flex flex-row top-0 left-0 right-0 z-10 backdrop-blur-sm bg-blue-50/75">
            {/* Back Button */}
            <div className="md:ml-2 flex center basis-12 grow-0 shrink-0 h-full">
                <BackButton onClick={backButtonOnClick} />
            </div>
            {/* User Info */}
            <section className="basis-full flex flex-row">
                {/* Avatar */}
                <section className="basis-12 md:basis-16 h-full grow-0 shrink-0 flex center">
                    <Avatar
                        online={Array.from(onlineUsers).includes(user.id || '')}
                        fullname={(user.first_name || '') + (user.last_name || '')}
                        src={''}
                        fallback={user.first_name.slice(0, 2)}
                    />
                </section>
                {/* info */}
                <section className="basis-full h-full pt-2 pl-1">
                    <p className="font-semibold text-gray-700 text-lg">{user.first_name + ' ' + user.last_name}</p>
                    {typingUsers.includes(user.id || '') && (
                        <div className="flex items-center gap-1">
                            <div className="basis-1 h-1 grow-0 shrink-0 bg-blue-500 rounded-full animate-[custom-pulse_0.85s_ease-in-out_0s_infinite] mt-0.5"></div>
                            <div className="basis-1 h-1 grow-0 shrink-0 bg-blue-500 rounded-full animate-[custom-pulse_0.85s_ease-in-out_0.15s_infinite] mt-0.5"></div>
                            <div className="basis-1 h-1 grow-0 shrink-0 bg-blue-500 rounded-full animate-[custom-pulse_0.85s_ease-in-out_0.3s_infinite] mt-0.5"></div>
                            <p className=" leading-[12px] text-blue-500 text-sm">typing</p>
                        </div>
                    )}
                </section>
            </section>
        </section>
    )
}

export default Header
