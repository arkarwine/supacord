import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../../components/avatar'
import BackButton from '../../components/backButton'
import ChatListItem from '../../components/chatListItem'
import Search from '../../components/search'
import { useChats } from '../../hooks/useChats'
import { useSearchProfiles } from '../../hooks/useSearchProfiles'
import useSession from '../../hooks/useSession'
import { useSubscribeMessages } from '../../hooks/useSubscribeMessages'
import { useTheme } from '../../hooks/useTheme'
import supabase from '../../lib/supabase'
import { ChatView } from '../../types/helpers.types'
import Id from './id'

export interface Chat extends ChatView {
    state: 'absent' | 'present' | 'pending'
}

function Chat() {
    const { session, profile } = useSession()
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()!

    const id = useParams()['*'] || ''
    const [search, setSearch] = useState('')

    const [menuOpened, setMenuOpened] = useState(false)

    useSubscribeMessages()

    const { data: defaultChats, isFetching: isChatsLoading } = useChats()
    const { data: searchProfiles, isFetching: isSearchLoading } = useSearchProfiles(search)

    const [currentChat, setCurrentChat] = useState<Chat | null>(null)
    const _currentChat = (defaultChats || []).find((chat) => chat.user?.id === id)

    if (_currentChat && currentChat?.state === 'absent') {
        setCurrentChat(_currentChat)
    } else if (id !== '' && currentChat === null && !isChatsLoading) {
        if (_currentChat) setCurrentChat(_currentChat)
        else
            supabase
                .from('profiles')
                .select()
                .eq('id', id)
                .then(({ data }) => {
                    if (!data || data?.length === 0) return navigate('/chat')
                    setCurrentChat({
                        id: null,
                        user: data[0] || undefined,
                        state: 'absent',
                        last_message: null,
                    })
                })
    }

    const closeMenu = () => setMenuOpened(false)
    useEffect(() => {
        document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu)
    }, [])

    if (!session) {
        return <Navigate to="/login" />
    } else if (!profile) {
        return <Navigate to="/create" />
    }

    const chats: Chat[] = (
        search === ''
            ? defaultChats || []
            : (searchProfiles || []).map((profile): Chat => {
                  const chat = (defaultChats || []).find((chat) => chat.user?.id === profile.id)
                  return {
                      id: chat?.id || null,
                      user: profile,
                      state: chat ? 'present' : 'absent',
                      last_message: chat?.last_message || null,
                  }
              })
    )
        .filter((chat) => chat.user?.id !== session.user.id)
        .sort((a, b) =>
            new Date(a.last_message?.created_at || 1) > new Date(b.last_message?.created_at || 0) ? -1 : 1,
        )

    return (
        <div className="text-secondary-title dark:text-dark-secondary-title black animate-[fade-in_0.5s_ease-in] overflow-hidden relative h-full border-sky-300 dark:border-gray-800 flex flex-row ">
            {/* Menu */}

            <section
                onClick={(e) => e.stopPropagation()}
                className={`duration-[400ms] ease-out flex flex-col transition-transform ${(id === '' || window.innerWidth > 768) && menuOpened ? '' : 'translate-x-[-100%]'} z-50 absolute w-56 top-0 bottom-0 left-0 bg-gradient-to-tr from-secondary-from/70 via-secondary-via/70 to-secondary-from/70 md:to-secondary-to/70 backdrop-blur-md rounded-r-lg shadow-sm dark:from-dark-secondary-from/70 dark:via-dark-secondary-via/70 dark:to-dark-secondary-from/70 md:dark:to-dark-secondary-to/70`}
            >
                <div className="basis-14 flex items-end justify-end grow-0 shrink-0 px-1">
                    <button
                        className={` transition-all h-12 w-12 flex justify-center items-center rounded-full hover:bg-hover-primary active:scale-95 mr-auto`}
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="transition-all w-6 h-6 stroke-black dark:stroke-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="transition-all w-6 h-6 stroke-muted dark:stroke-dark-muted"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                />
                            </svg>
                        )}
                    </button>
                    <BackButton onClick={() => closeMenu()} />
                </div>
                <section
                    className={` basis-16 grow-0 shrink-0 flex justify-evenly ${menuOpened ? 'animate-[scale-in_0.5s_ease-out]' : 'animate-none'}`}
                >
                    <div className="ml-2 basis-12 grow-0 shrink-0 flex center">
                        <Avatar
                            fullname={profile.first_name + (profile.last_name || '')}
                            id={profile.avatar}
                            fallback={profile.first_name.slice(0, 2)}
                        />
                    </div>
                    <div className="basis-full pl-2 pt-2.5 overflow-x-hidden">
                        <p className="font-[700] text-secondary-title truncate dark:text-dark-secondary-title">
                            {profile.first_name + ' ' + profile.last_name}
                        </p>
                        <p className="text-secondary-title dark:text-dark-secondary-title text-sm text-start leading-[12px] pb-1 truncate">
                            {'@' + profile.username}
                        </p>
                    </div>
                </section>
                <section className="h-12 flex p-1">
                    <button
                        onClick={() => {
                            closeMenu()
                            setCurrentChat({
                                user: profile!,
                                state: 'present',
                                id: session.user.id,
                                last_message: null,
                            })
                            navigate(session.user.id)
                        }}
                        className="hover:bg-hover-primary flex items-center basis-full h-full transition-all rounded-lg active:scale-95"
                    >
                        <div className="w-12 center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 stroke-black dark:stroke-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </div>

                        <p className="ml-2">My Profile</p>
                    </button>
                </section>
                <hr className="mx-1" />
                <section className="h-12 mt-auto flex p-1 mb-2">
                    <button
                        onClick={() => {
                            supabase.auth.signOut()
                        }}
                        className="hover:bg-hover-primary flex items-center basis-full h-full transition-all rounded-lg active:scale-95"
                    >
                        <div className="w-12 center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                />
                            </svg>
                        </div>

                        <p className="ml-2">Logout</p>
                    </button>
                </section>
            </section>
            {/* Section 1 */}
            <section
                className={`bg-primary dark:bg-dark-primary grow-0 shrink-0 transition-all duration-300 ease-out h-full -md:absolute -md:w-full md:basis-80 lg:basis-96 flex flex-col ${id !== '' && currentChat !== null ? '-md:translate-x-[-64px]' : ''}`}
            >
                {/* LeftSideBar Header */}
                <section className="px-2 gap-2 grow-0 shrink-0 basis-14 flex items-center justify-evenly">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpened(true)
                        }}
                        className="h-10 basis-10 grow-0 shrink-0 flex center rounded-lg hover:bg-hover-primary active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 stroke-muted dark:stroke-dark-muted"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                    <Search
                        onChange={(e) => setSearch(e.target.value)}
                        className="box-content h-[2.25rem] basis-full mr-1"
                        isLoading={isSearchLoading}
                    />
                </section>
                {/* ChatList */}
                <section className="transition-all scrollbar-track-transparent scrollbar-thumb-sky-200 dark:scrollbar-thumb-slate-500 [&:not(:hover)]:scrollbar-thumb-transparent scrollbar-thin basis-full md:pl-2 overflow-y-scroll overflow-x-hidden">
                    {chats.length > 0 ? (
                        chats.map((chat) => (
                            <ChatListItem
                                chat={chat}
                                key={chat.user?.username}
                                onClick={(e) => {
                                    if (menuOpened && window.innerWidth < 768) return
                                    else if (window.innerWidth > 768) e.stopPropagation()
                                    setCurrentChat(chat)
                                    // TODO
                                    navigate(chat.user?.id || '')
                                }}
                            />
                        ))
                    ) : !isSearchLoading ? (
                        search !== '' ? (
                            <div className="text-center pt-40">
                                <p className="text-muted dark:text-dark-muted">No Results Found</p>
                                <p className=" text-[0.9rem]">Try searching something else.</p>
                            </div>
                        ) : (
                            <div className="text-muted text-center pt-40 text-[0.9rem]">
                                <p>Nothing here.</p>
                            </div>
                        )
                    ) : null}
                </section>
            </section>
            {/* Section 2 */}
            <section
                className={` bg-gradient-to-tr from-secondary-from via-secondary-via to-secondary-from md:to-secondary-to relative md:border-l-2 dark:from-dark-secondary-from dark:via-dark-secondary-via dark:to-dark-secondary-from dark:md:to-dark-secondary-to duration-[400ms] ease-out transition-all h-full -md:absolute -md:w-full basis-full ${
                    id !== '' && currentChat !== null ? '' : '-md:translate-x-full'
                }`}
            >
                {currentChat !== null && (id !== '' || window.innerWidth < 768) && <Id key={id} chat={currentChat} />}
            </section>
        </div>
    )
}

export default Chat
