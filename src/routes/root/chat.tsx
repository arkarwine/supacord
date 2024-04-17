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
import supabase from '../../lib/supabase'
import { Profile } from '../../types/helpers.types'
import Id from './id'

export interface Chat {
    id: string | null
    user?: Profile
    state: 'absent' | 'present' | 'pending'
}

function Chat() {
    const { session, profile } = useSession()
    const navigate = useNavigate()

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
                  }
              })
    ).filter((chat) => chat.user?.id !== session.user.id)

    return (
        <div className="animate-[fade-in_0.5s_ease-in] overflow-hidden relative h-full border-sky-300 flex flex-row">
            {/* Menu */}

            <section
                onClick={(e) => e.stopPropagation()}
                className={`duration-[400ms] ease-out flex flex-col transition-all ${(id === '' || window.innerWidth > 768) && menuOpened ? '' : 'translate-x-[-100%]'} z-50 absolute w-56 top-0 bottom-0 left-0 bg-gradient-to-tr from-blue-200/70 via-sky-200/70 to-blue-200/70 md:to-cyan-200/70 backdrop-blur-md rounded-r-lg shadow-sm`}
            >
                <div className="basis-14 flex items-end justify-end grow-0 shrink-0 pr-1">
                    <BackButton onClick={() => closeMenu()} />
                </div>
                <section
                    className={` basis-16 grow-0 shrink-0 flex justify-evenly ${menuOpened ? 'animate-[scale-in_0.5s_ease-out]' : 'animate-none'}`}
                >
                    <div className="ml-2 basis-12 grow-0 shrink-0 flex center">
                        <Avatar
                            fullname={profile.first_name + (profile.last_name || '')}
                            src=""
                            fallback={profile.first_name.slice(0, 2)}
                        />
                    </div>
                    <div className="basis-full pl-2 pt-2.5">
                        <p className="font-[700] text-gray-700">{profile.first_name + ' ' + profile.last_name}</p>
                        <p className="text-slate-[400ms] text-sm text-start leading-[12px]">{'@' + profile.username}</p>
                    </div>
                </section>
                <section className="h-12 flex p-1">
                    <button
                        onClick={() => {
                            closeMenu()
                            setCurrentChat({ user: profile!, state: 'present', id: 'me' })
                            navigate(session.user.id!)
                        }}
                        className="hover:bg-[#80808020] flex items-center basis-full h-full transition-all rounded-lg active:scale-95"
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
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </div>

                        <p className="ml-2">My Profile</p>
                    </button>
                </section>
                <hr className="mx-1" />
            </section>
            {/* Section 1 */}
            <section
                className={` grow-0 shrink-0 transition-all duration-300 ease-out h-full -md:absolute -md:w-full md:basis-80 lg:basis-96 flex flex-col ${id !== '' && currentChat !== null ? '-md:translate-x-[-64px]' : ''}`}
            >
                {/* LeftSideBar Header */}
                <section className="px-2 gap-2 grow-0 shrink-0 basis-14 flex items-center justify-evenly">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpened(true)
                        }}
                        className="h-10 basis-10 grow-0 shrink-0 flex center rounded-lg hover:bg-[#80808020] active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 stroke-slate-600"
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
                <section className="transition-all [&:not(:hover)]:scrollbar-thumb-transparent scrollbar-thin basis-full md:pl-2 overflow-y-scroll overflow-x-hidden">
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
                                <p className="text-slate-500">No Results Found</p>
                                <p className=" text-[0.9rem]">Try searching something else.</p>
                            </div>
                        ) : (
                            <div className=" text-center pt-40 text-[0.9rem]">
                                <p>Nothing here.</p>
                            </div>
                        )
                    ) : null}
                </section>
            </section>
            {/* Section 2 */}
            <section
                className={` bg-gradient-to-tr from-blue-200 via-sky-200 to-blue-200 md:to-cyan-200 relative md:border-l-2 duration-[400ms] ease-out transition-all h-full -md:absolute -md:w-full basis-full ${
                    id !== '' && currentChat !== null ? '' : '-md:translate-x-full'
                }`}
            >
                {currentChat !== null && (id !== '' || window.innerWidth < 768) && <Id key={id} chat={currentChat} />}
            </section>
        </div>
    )
}

export default Chat
