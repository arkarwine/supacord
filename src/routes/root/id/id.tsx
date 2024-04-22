import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Avatar from '../../../components/avatar'
import BackButton from '../../../components/backButton'
import { ContextMenu, ContextMenuItem } from '../../../components/contextMenu'
import Header from '../../../components/header'
import ChatMessage from '../../../components/message'
import { useChatsMutation } from '../../../hooks/useChatsMutation'
import { useCheckUsername } from '../../../hooks/useCheckUsername'
import { useCreateMessagesMutation } from '../../../hooks/useCreateMessagesMutation'
import { useDeleteMessagesMutation } from '../../../hooks/useDeleteMessagesMutation'
import { useMessages } from '../../../hooks/useMessages'
import { usePresence } from '../../../hooks/usePresence'
import useSession from '../../../hooks/useSession'
import { useToasts } from '../../../hooks/useToasts'
import { useUpdateMessagesMutation } from '../../../hooks/useUpdateMessagesMutation'
import { Message } from '../../../types/helpers.types'
import { Chat } from '../chat'

type Props = {
    chat: Chat
}

export type ChatMessage = Pick<Message, 'text' | 'sender_id' | 'reply_to_message_id'> & Partial<Message>

function Id({ chat }: Props) {
    const { session, profile, updateProfile } = useSession()
    const navigate = useNavigate()
    const addToast = useToasts()!
    if (chat.user?.id === session!.user.id) {
        const firstNameRef = useRef<HTMLInputElement>(null)
        const lastNameRef = useRef<HTMLInputElement>(null)
        const usernameRef = useRef<HTMLInputElement>(null)
        const [firstName, setFirstName] = useState(profile!.first_name || '')
        const [lastName, setLastName] = useState(profile!.last_name || '')
        const [username, setUsername] = useState(profile!.username || '')
        const [edit, setEdit] = useState<'firstName' | 'lastName' | 'username' | null>(null)
        const [uploading, setUploading] = useState(false)

        const { data: usernameIsAvailable, isFetching } = useCheckUsername(username)
        const usernameIsValid = !/[^a-zA-Z1-9_]/g.test(username)

        return (
            <div className="h-full md:p-4 flex flex-col items-center gap-y-2 ">
                <section className="max-w-[768px] h-min w-full md:bg-primary/50 dark:md:bg-dark-primary/50 rounded-lg flex">
                    <div className="p-1 w-14">
                        <BackButton onClick={() => navigate('/chat')} />
                    </div>
                    <div className="w-min p-4">
                        <button
                            disabled={isFetching || !usernameIsValid}
                            onClick={() => {
                                if (
                                    username === profile!.username &&
                                    firstName === profile!.first_name &&
                                    lastName === profile!.last_name
                                ) {
                                    return addToast({
                                        text: 'Successfully updated profile',
                                        type: 'success',
                                    })
                                }
                                updateProfile(
                                    {
                                        username: username,
                                        first_name: firstName,
                                        last_name: lastName,
                                    },
                                    {
                                        onSuccess: () => {
                                            addToast({
                                                text: 'Successfully updated profile',
                                                type: 'success',
                                            })
                                        },
                                    },
                                )
                            }}
                            className="transition-all bg-button-secondary dark:bg-dark-button-secondary w-16 py-1 rounded-lg [&:hover:not(:disabled)]:bg-button-secondary/80 [&:hover:not(:disabled)]:dark:bg-dark-button-secondary/80 [&:active:not(:disabled)]:text-muted [&:active:not(:disabled)]:dark:text-dark-muted [&:active:not(:disabled)]:scale-95"
                        >
                            Save
                        </button>
                    </div>
                    <div className=" h-min flex items-center w-full pb-4">
                        <div className="group relative basis-24 grow-0 shrink-0 peer rounded-full h-24 center overflow-hidden">
                            <Avatar
                                fullname={(profile!.first_name || '') + (profile!.last_name || '')}
                                id={profile!.avatar || null}
                                fallback={profile!.first_name.slice(0, 2)}
                                className="scale-[2] aspect-square"
                            />
                            <input
                                onChange={(e) => {
                                    const files = e.currentTarget.files
                                    if (files) {
                                        const url = `https://api.cloudinary.com/v1_1/doiynq1dh/upload`
                                        const formData = new FormData()
                                        const blob = files[0].slice(0, files[0].size, files[0].type)
                                        const file = new File([blob], session!.user.id, { type: files[0].type })
                                        formData.append('file', file)
                                        formData.append('upload_preset', 'avatar_sm')

                                        fetch(url, {
                                            method: 'POST',
                                            body: formData,
                                        })
                                            .then((res) => res.json())
                                            .then((res) => {
                                                updateProfile(
                                                    {
                                                        avatar: res.public_id as string,
                                                    },
                                                    {
                                                        onSettled: () => setUploading(false),
                                                    },
                                                )
                                            })
                                    }
                                }}
                                type="file"
                                id="fileInput"
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                disabled={uploading}
                                onClick={() => {
                                    const fileInput = document.getElementById('fileInput')!
                                    fileInput.click()
                                }}
                                className="rounded-full transition-all opacity-0 absolute group-hover:opacity-100 bg-hover-secondary inset-0 center"
                            >
                                {uploading ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="transition-all w-7 h-7 stroke-white"
                                    >
                                        <style
                                            dangerouslySetInnerHTML={{
                                                __html: '.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}',
                                            }}
                                        />
                                        <g className="spinner_V8m1">
                                            <circle cx={12} cy={12} r="9.5" fill="none" strokeWidth={2} />
                                        </g>
                                    </svg>
                                ) : (
                                    <svg
                                        type="button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1}
                                        stroke="currentColor"
                                        className="transition-all w-7 h-7 stroke-white"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <section className=" pt-14 h-full basis-full flex flex-col justify-center gap-y-2 pl-4">
                            <div className="flex items-center group">
                                <div>
                                    <p className="text-xs leading-[8px] text-muted dark:text-dark-muted">First Name</p>

                                    <input
                                        maxLength={32}
                                        ref={firstNameRef}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        readOnly={edit !== 'firstName'}
                                        autoComplete="off"
                                        className="bg-transparent outline-none"
                                        value={firstName}
                                    ></input>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEdit(edit === 'firstName' ? null : 'firstName')
                                        firstNameRef.current?.focus()
                                    }}
                                    className="transition-all w-8 h-8 center hover:bg-hover-primary rounded-full active:scale-95"
                                >
                                    {edit !== 'firstName' ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center group">
                                <div className="">
                                    <p className="text-xs leading-[8px] text-muted dark:text-dark-muted">Last Name</p>
                                    <input
                                        maxLength={32}
                                        ref={lastNameRef}
                                        onChange={(e) => setLastName(e.target.value)}
                                        readOnly={edit !== 'lastName'}
                                        autoComplete="off"
                                        className="bg-transparent outline-none"
                                        value={lastName}
                                    ></input>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEdit(edit === 'lastName' ? null : 'lastName')
                                        lastNameRef.current?.focus()
                                    }}
                                    className="transition-all w-8 h-8 center hover:bg-hover-primary rounded-full active:scale-95"
                                >
                                    {edit !== 'lastName' ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <hr className="mr-1 " />
                            <div className="flex items-center group">
                                <div className="">
                                    <p className="text-xs leading-[8px] text-muted dark:text-dark-muted">Username</p>
                                    <input
                                        maxLength={32}
                                        ref={usernameRef}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                        }}
                                        readOnly={edit !== 'username'}
                                        autoComplete="off"
                                        className="bg-transparent outline-none"
                                        value={username}
                                    ></input>
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
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEdit(edit === 'username' ? null : 'username')
                                        usernameRef.current?.focus()
                                    }}
                                    className="transition-all w-8 h-8 center hover:bg-hover-primary rounded-full active:scale-95"
                                >
                                    {edit !== 'username' ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-4 h-4 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 stroke-muted dark:stroke-dark-muted transition-all"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m4.5 12.75 6 6 9-13.5"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        )
    }
    const submitRef = useRef<HTMLButtonElement>(null)

    const presence = usePresence()
    const channel = presence?.channel

    const messageListRef = useRef<VirtuosoHandle>(null)
    const receivedMenu = useRef<HTMLDivElement>(null)
    const sentMenu = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const [activeMenu, setActiveMenu] = useState<React.RefObject<HTMLDivElement> | null>(null)
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null)

    const [editMessageId, setEditMessageId] = useState<number | null>(null)
    const [replyMessageId, setReplyMessageId] = useState<number | null>(null)

    const { data: _messages, isLoading } = useMessages(chat.id || '')

    const messages: ChatMessage[] = useMemo<ChatMessage[]>(
        () => (_messages || []).sort(({ created_at: a }, { created_at: b }) => (new Date(a) > new Date(b) ? 1 : -1)),
        [_messages],
    )
    const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([])
    const [currentMessage, setCurrentMessage] = useState('')

    const typing = useRef(false)

    useEffect(() => {
        if (currentMessage !== '' && !typing.current) {
            typing.current = true
            channel?.track({
                typing: chat.id,
            })
        } else if (currentMessage === '') {
            typing.current = false
            channel?.track({
                typing: null,
            })
        }
    }, [currentMessage])

    const { mutate: sendMessages } = useCreateMessagesMutation()
    const { mutate: deleteMessage } = useDeleteMessagesMutation()
    const { mutate: editMessage } = useUpdateMessagesMutation()

    const { mutateAsync: addChat } = useChatsMutation()

    function scrollTo(id: number) {
        hideContextMenu()
        setActiveMessageId(id)
        messageListRef.current?.scrollToIndex({
            index: messages.findIndex((message) => message.id === id),
            align: 'center',
            behavior: 'smooth',
        })
    }

    const showContextMenu = ({
        menu,
        posX,
        posY,
        message_id,
    }: {
        menu: React.RefObject<HTMLDivElement>
        posX: number
        posY: number
        message_id: number
    }) => {
        if (!menu.current) throw Error()
        setActiveMessageId(message_id)
        setActiveMenu(menu)

        const menuWidth = menu.current.offsetWidth
        const menuHeight = menu.current.offsetHeight

        if (posX + menuWidth > window.innerWidth) {
            posX = window.innerWidth - menuWidth - (window.innerWidth - posX)
        }

        if (posY + menuHeight > window.innerHeight - 72) {
            posY = window.innerHeight - 72 - menuHeight - (window.innerHeight - 72 - posY)
        }

        menu.current.style.left = posX + 'px'
        menu.current.style.top = posY + 'px'
    }

    const hideContextMenu = () => setActiveMenu(null)

    const resetMessageStates = () => {
        hideContextMenu()
        setActiveMessageId(null)
    }

    useEffect(() => {
        document.addEventListener('click', resetMessageStates)
        return () => document.removeEventListener('click', resetMessageStates)
    }, [])

    const baseContextMenuItemOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        resetMessageStates()
        inputRef.current?.focus()
    }

    const contextMenuItemReplyOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        baseContextMenuItemOnClick(e)
        setReplyMessageId(activeMessageId)
        setEditMessageId(null)
    }

    const contextMenuItemEditOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        baseContextMenuItemOnClick(e)
        setReplyMessageId(null)
        setCurrentMessage(messages.find((message) => message.id === activeMessageId)?.text || '')
        setEditMessageId(activeMessageId)
    }

    const contextMenuItemDeleteOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!activeMessageId || !chat.id) throw Error()
        baseContextMenuItemOnClick(e)
        deleteMessage({ message_id: activeMessageId, chat_id: chat.id })
    }

    useEffect(() => {
        inputRef.current!.style.height = '1px'
        inputRef.current!.style.height = `${inputRef.current!.scrollHeight}px`
    }, [currentMessage])

    return (
        <>
            {/* Header */}
            <Header
                backButtonOnClick={(e) => {
                    e.stopPropagation()
                    channel?.track({
                        typing: null,
                    })
                    navigate('/chat')
                }}
                user={chat.user!}
            />
            {/* ContextMenus */}
            <ContextMenu
                // ReceivedMessageContextMenu
                visible={activeMenu === receivedMenu}
                menuRef={receivedMenu}
            >
                <ContextMenuItem
                    // Reply Message ContextItem
                    onClick={contextMenuItemReplyOnClick}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mx-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                            />
                        </svg>
                    }
                    label={'Reply'}
                />
            </ContextMenu>
            <ContextMenu
                // SentMessageContextMenu
                visible={activeMenu === sentMenu}
                menuRef={sentMenu}
            >
                <ContextMenuItem
                    // Reply Message ContextItem
                    onClick={contextMenuItemReplyOnClick}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mx-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                            />
                        </svg>
                    }
                    label={'Reply'}
                />

                <ContextMenuItem
                    // Edit Message ContextItem
                    onClick={contextMenuItemEditOnClick}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mx-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            />
                        </svg>
                    }
                    label={'Edit'}
                />

                <ContextMenuItem
                    // Delete Message ContextItem
                    onClick={contextMenuItemDeleteOnClick}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mx-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    }
                    label={'Delete'}
                />
            </ContextMenu>
            <Virtuoso
                onScroll={() => {
                    if (activeMenu !== null) resetMessageStates()
                }}
                followOutput={() => true}
                alignToBottom
                computeItemKey={(index) => messages[index]?.id || -index}
                initialTopMostItemIndex={{ index: messages.length + pendingMessages.length - 1, align: 'end' }}
                ref={messageListRef}
                className="transition-all h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sky-200 dark:scrollbar-thumb-slate-500 [&:not(:hover)]:scrollbar-thumb-transparent"
                totalCount={messages.length + pendingMessages.length}
                components={{
                    Header: () => <div className="h-16"></div>,
                    Footer: () => (
                        <div
                            className={`transition-all ${replyMessageId !== null || editMessageId !== null ? 'h-[124px]' : 'h-[76px]'}`}
                        ></div>
                    ),
                    EmptyPlaceholder: () =>
                        isLoading ? (
                            <div className="h-full flex center">
                                <svg
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 fill-none stroke-blue-500 transition-all"
                                >
                                    <style
                                        dangerouslySetInnerHTML={{
                                            __html: '.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}',
                                        }}
                                    />
                                    <g className="spinner_V8m1">
                                        <circle cx={12} cy={12} r="9.5" fill="none" strokeWidth={2} />
                                    </g>
                                </svg>
                            </div>
                        ) : null,
                }}
                itemContent={(index) => {
                    const message = messages.at(index) || pendingMessages.at(index - messages.length)

                    if (!message) throw Error()
                    const IAmSender = message.sender_id === session!.user.id
                    const replyMessage = messages.find((msg) => msg.id === message.reply_to_message_id)
                    const _showContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, message_id: number) => {
                        showContextMenu({
                            menu: IAmSender ? sentMenu : receivedMenu,
                            posX: e.clientX,
                            posY: e.clientY,
                            message_id: message_id,
                        })
                        e.stopPropagation()
                        e.preventDefault()
                    }

                    return (
                        <ChatMessage
                            key={message.id?.toString() || index.toString()}
                            id={message.id?.toString() || index.toString()}
                            isActive={activeMessageId === message.id}
                            isSender={message.sender_id === session!.user.id}
                            text={message.text}
                            createdAt={message.created_at}
                            onClick={(e) => {
                                if (window.innerWidth < 768 && message.id) _showContextMenu(e, message.id)
                            }}
                            onContextMenu={(e) => {
                                if (message.id) _showContextMenu(e, message.id)
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                inputRef.current?.focus()
                                setReplyMessageId(message.id || index)
                            }}
                            replyText={replyMessage?.text}
                            replyTextOnClick={(e) => {
                                e.stopPropagation()
                                const id = messages.find((msg) => msg.id === message.id)?.reply_to_message_id
                                if (id) scrollTo(id)
                            }}
                        />
                    )
                }}
            />
            <form
                className="backdrop-blur-sm flex flex-col absolute left-0 bottom-0 right-0 pb-2 px-2 "
                onSubmit={(e) => {
                    inputRef.current!.style.height = '24px'
                    e.preventDefault()
                    inputRef.current?.focus()
                    setCurrentMessage('')
                    if (!session || !chat.user) throw Error()

                    if (editMessageId !== null && chat.id) {
                        setEditMessageId(null)
                        editMessage({
                            message_id: editMessageId as number,
                            text: currentMessage,
                            chat_id: chat.id,
                        })
                        return
                    }
                    setReplyMessageId(null)
                    const currentText = currentMessage.trim()
                    const newMessage: ChatMessage = {
                        text: currentText,
                        sender_id: session.user.id,
                        reply_to_message_id: replyMessageId,
                        chat_id: chat.id || undefined,
                    }
                    const newPendingMessages = [...pendingMessages, newMessage]
                    setPendingMessages((_pendingMessages) => [..._pendingMessages, newMessage])

                    if (chat.state === 'absent') {
                        addChat(chat.user).then((_chat) => {
                            if (_chat.id === null) throw Error()
                            const chat_id = _chat.id
                            // TODO: Error
                            sendMessages(
                                newPendingMessages
                                    .filter((message) => message.chat_id === undefined)
                                    .map((message, index) => ({
                                        ...message,
                                        chat_id: chat_id,
                                        start: index === 0,
                                    })),
                                {
                                    onSuccess: () => {
                                        setPendingMessages((_pendingMessages) =>
                                            _pendingMessages.filter((message) => message.chat_id !== undefined),
                                        )
                                    },
                                },
                            )
                        })
                    } else if (chat.state === 'present' && chat.id) {
                        sendMessages(
                            [
                                {
                                    chat_id: chat.id,
                                    text: currentText,
                                    receiver_id: chat.user.id,
                                    reply_to_message_id: replyMessageId,
                                },
                            ],
                            {
                                onSettled: () => {
                                    // TODO: Handle Error
                                    setPendingMessages((_pendingMessages) =>
                                        _pendingMessages.filter((message) => message !== newMessage),
                                    )
                                },
                            },
                        )
                    }
                }}
            >
                <div
                    className={`${replyMessageId !== null || editMessageId !== null ? 'h-12 opacity-100' : 'h-0 translate-y-full opacity-0'} py-1 duration-300 transition-all bg-primary/90 dark:bg-dark-primary/90 backdrop-blur-sm rounded-t-lg flex items-center shadow-sm`}
                >
                    <div className="basis-10 grow-0 shrink-0  mx-1 flex center">
                        {replyMessageId !== null && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="basis-5 grow-0 shrink-0 w-5 h-5 stroke-muted dark:stroke-dark-muted"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                />
                            </svg>
                        )}
                        {editMessageId !== null && (
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                />
                            </svg>
                        )}
                    </div>
                    <button
                        className="px-3 rounded-lg bg-reply-message dark:bg-dark-reply-message h-full flex items-center basis-full overflow-hidden"
                        onClick={(e) => {
                            e.stopPropagation()
                            const id = replyMessageId || editMessageId
                            if (id) scrollTo(id)
                        }}
                        type="button"
                    >
                        <p className="text-muted dark:text-dark-muted truncate">
                            {
                                messages?.find(
                                    (message) => message.id === editMessageId || message.id === replyMessageId,
                                )?.text
                            }
                        </p>
                    </button>
                    <button
                        className="basis-12 mx-1 grow-0 shrink-0 rounded-lg hover:bg-hover-primary h-full flex center"
                        onClick={() => {
                            if (editMessageId) setCurrentMessage('')
                            setEditMessageId(null)
                            setReplyMessageId(null)
                        }}
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 stroke-muted dark:stroke-dark-muted"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div
                    className={`transition-all flex w-full gap-2 bg-primary dark:bg-dark-primary ${replyMessageId !== null || editMessageId !== null ? 'rounded-b-lg' : 'rounded-lg'}`}
                >
                    <section className={`transition-all basis-full py-2 px-6 min-h-14 flex items-center`}>
                        <textarea
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    submitRef.current?.click()
                                    e.preventDefault()
                                }
                            }}
                            ref={inputRef}
                            value={currentMessage}
                            autoComplete="off"
                            wrap="soft"
                            id="messageTextInput"
                            className="w-full h-6 bg-transparent outline-none resize-none"
                            placeholder="Message"
                            onChange={(e) => {
                                setCurrentMessage(e.target.value)
                            }}
                        />
                    </section>
                    <div className=" basis-14 grow-0 shrink-0 p-1 shadow-sm center">
                        <button
                            ref={submitRef}
                            className={`transition-all w-12 h-12 flex center rounded-lg ${currentMessage === '' ? '' : 'hover:bg-hover-primary'} `}
                            disabled={currentMessage === ''}
                            type="submit"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`h-6 w-6 ${currentMessage === '' ? 'fill-slate-400' : 'fill-blue-500'} transition-all ease-in-out`}
                            >
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Id
