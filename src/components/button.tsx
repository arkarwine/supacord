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
                'transition-all h-12 bg-gradient-to-tr from-blue-400 via-sky-400 to-cyan-400 rounded-lg text-white text-sm hover:from-blue-400/90 hover:via-sky-400/90 hover:to-cyan-400/90 ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
