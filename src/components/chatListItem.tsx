import React, { useContext } from 'react'
import useSession from '../hooks/useSession'
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
    const { session } = useSession()
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']

    function isDateInThisWeek(date: Date) {
        const todayObj = new Date()
        const todayDate = todayObj.getDate()
        const todayDay = todayObj.getDay()

        // get first date of week
        const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay))

        // get last date of week
        const lastDayOfWeek = new Date(firstDayOfWeek)
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6)

        // if date is equal or within the first and last dates of the week
        return date >= firstDayOfWeek && date <= lastDayOfWeek
    }

    let createdDate
    if (chat.last_message) createdDate = new Date(chat.last_message.created_at)

    return (
        <div
            className="w-full transition-all h-16 mt-1 flex flex-row md:rounded-lg hover:bg-hover-primary"
            key={chat.user?.username}
            onClick={onClick}
        >
            <section className="basis-16 h-full grow-0 shrink-0 flex center">
                <Avatar
                    key={chat.user?.avatar}
                    online={Array.from(onlineUsers).includes(chat.user?.id || '')}
                    fullname={(chat.user?.first_name || '') + (chat.user?.last_name || '')}
                    id={chat.user?.avatar || null}
                    fallback={chat.user?.first_name.slice(0, 2)}
                />
            </section>
            <section className="relative flex flex-col basis-full h-full justify-center overflow-hidden">
                <p className=" text-muted dark:text-dark-muted truncate absolute right-2 top-2 text-xs">
                    {createdDate &&
                        (isDateInThisWeek(createdDate)
                            ? createdDate.toDateString() === new Date().toDateString()
                                ? createdDate.toLocaleString('en-US', {
                                      hour: 'numeric',
                                      minute: 'numeric',
                                      hour12: false,
                                  })
                                : days[createdDate.getDay()]
                            : createdDate.toLocaleDateString())}
                </p>

                <p className="font-[700] text-black dark:text-white truncate leading-tight pr-10">
                    {chat.user?.first_name + ' ' + chat.user?.last_name}
                </p>
                {chat.last_message && (
                    <p className=" max-w-40 text-muted dark:text-dark-muted truncate leading-tight">
                        {chat.last_message.sender_id === session!.user.id ? 'You' : chat.user?.first_name}:{' '}
                        {chat.last_message.text}
                    </p>
                )}
            </section>
        </div>
    )
}

export default ChatListItem
