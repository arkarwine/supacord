import React, { ForwardedRef, forwardRef } from 'react'

type Props = {
    id: string
    onClick: React.MouseEventHandler<HTMLDivElement>
    onDoubleClick: React.MouseEventHandler<HTMLDivElement>
    onContextMenu: React.MouseEventHandler<HTMLDivElement>
    text: string
    createdAt?: string
    isActive: boolean
    isSender: boolean
    replyText?: string
    replyTextOnClick: React.MouseEventHandler<HTMLButtonElement>
}

const ChatMessage = forwardRef(
    (
        {
            id,
            onClick,
            onContextMenu,
            onDoubleClick,
            text,
            createdAt,
            isActive,
            isSender,
            replyText,
            replyTextOnClick,
        }: Props,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        return (
            <div
                ref={ref}
                className={` relative pl-2 transition-all ${isActive ? 'bg-[#80808020]' : ''} group h-min flex ${isSender ? 'justify-end' : 'justify-start'} py-1`}
                id={id}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onDoubleClick={onDoubleClick}
            >
                <section
                    className={`relative max-w-[40vw] min-w-16 pt-2 pb-4 px-2 rounded-t-xl ${isSender ? 'rounded-br-sm rounded-bl-xl text-end' : 'rounded-br-xl rounded-bl-sm text-start'} bg-blue-50`}
                >
                    {replyText && (
                        <button
                            onClick={replyTextOnClick}
                            className={`w-full overflow-hidden h-10 bg-blue-100 px-2 rounded-lg ${isSender ? 'text-end' : 'text-start'}`}
                        >
                            <p className="text-slate-600 truncate">{replyText}</p>
                        </button>
                    )}
                    <p className="select-text break-words mx-2">{text}</p>
                    {createdAt ? (
                        <p
                            className={`${isSender ? 'left-1.5' : 'right-1.5'} bottom-0.5 absolute text-[10px] text-slate-400`}
                        >
                            {new Date(createdAt).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false,
                            })}
                        </p>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="currentColor"
                            className="w-3 h-3 absolute left-1 bottom-1 stroke-slate-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    )}
                </section>
            </div>
        )
    },
)

export default ChatMessage
