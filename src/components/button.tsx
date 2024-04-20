import React from 'react'

type Props = {
    className?: string
    children?: React.ReactNode
    disabled?: boolean
}

function Button({ className = '', children, disabled }: Props) {
    return (
        <button
            className={
                'transition-all h-12 bg-gradient-to-tr duration-300 from-blue-400 via-sky-400 to-cyan-400 rounded-lg text-white text-sm [&:hover:not(:disabled)]:from-blue-400/90 [&:hover:not(:disabled)]:via-sky-400/90 [&:hover:not(:disabled)]:to-cyan-400/90 [&:active:not(:disabled)]:scale-95 ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
