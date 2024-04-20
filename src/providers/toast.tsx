import React, { createContext, useRef, useState } from 'react'

export interface Toast {
    type: 'success' | 'error' | 'info'
    text: string
}

export interface _Toast extends Toast {
    id: number
    exit: boolean
}

export const ToastContext = createContext<((toast: Toast) => void) | null>(null)

function ToastProvider({ children }: React.PropsWithChildren) {
    const toastId = useRef(0)
    const [toasts, setToasts] = useState<_Toast[]>([])

    const addToast = (toast: Toast) => {
        toastId.current = toastId.current + 1
        const newToast = {
            ...toast,
            id: toastId.current,
        }
        setToasts((_toasts) => [
            ..._toasts,
            {
                ...newToast,
                exit: false,
            },
        ])
        setTimeout(() => {
            setToasts((_toasts) =>
                _toasts.map((_toast) =>
                    _toast.id === newToast.id
                        ? {
                              ..._toast,
                              exit: true,
                          }
                        : _toast,
                ),
            )
        }, 5000)
        setTimeout(() => {
            setToasts((_toasts) => _toasts.filter((_toast) => _toast.id !== newToast.id))
        }, 5300)
    }

    return (
        <ToastContext.Provider value={addToast}>
            {toasts.map((toast) => {
                return (
                    <div
                        key={toast.id}
                        className={` flex absolute animate-[slide-in_0.2s_ease-out] py-6 pr-24 bg-toast dark:bg-dark-toast rounded-lg bottom-4 right-4 z-50 shadow-md ${toast.exit ? 'animate-[fade-out_0.3s_ease-out_forwards]' : ''}`}
                    >
                        <div className="w-6 center ml-3 mr-1">
                            {toast.type === 'success' ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-green-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            ) : toast.type === 'error' ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-red-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 stroke-muted dark:stroke-dark-muted"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                    />
                                </svg>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setToasts((_toasts) => _toasts.filter((_toast) => _toast.id !== toast.id))
                            }}
                            className=" absolute right-1 top-1 w-8 h-8 center rounded-full hover:bg-hover-primary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 stroke-dark-muted"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <p>{toast.text}</p>
                    </div>
                )
            })}{' '}
            {children}
        </ToastContext.Provider>
    )
}

export default ToastProvider
