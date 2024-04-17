import React, { useContext } from 'react'
import { PresenceContext } from '../providers/realtime'
import { Chat } from '../routes/root/chat'
import Avatar from './avatar'

type Props = {
    chat: Chat
    onClick?: React.MouseEventHandler<HTMLElement> | undefined
}

function ChatListItem({ chat, onClick }: Props) {
    const presence = useContext(PresenceContext)
    const onlineUsers = Object.keys(presence?.presenceState || [])
    return (
        <div
            className="w-full transition-all h-16 mt-1 flex flex-row md:rounded-lg hover:bg-[#80808020]"
            key={chat.user?.username}
            onClick={onClick}
        >
            <section className="basis-16 h-full grow-0 shrink-0 flex center">
                <Avatar
                    online={Array.from(onlineUsers).includes(chat.user?.id || '')}
                    fullname={(chat.user?.first_name || '') + (chat.user?.last_name || '')}
                    src={''}
                    fallback={chat.user?.first_name.slice(0, 2)}
                />
            </section>
            <section className="basis-full h-full pt-2.5 pl-0.5">
                <p className="font-[700] text-slate-700 text-base">
                    {chat.user?.first_name + ' ' + chat.user?.last_name}
                </p>
            </section>
        </div>
    )
}

export default ChatListItem
