import React from 'react'

type Props = {
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

function BackButton({ onClick }: Props) {
    return (
        <button
            className={` transition-all h-12 w-12 flex justify-center items-center rounded-full hover:bg-hover-primary active:scale-95`}
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-muted dark:stroke-dark-muted"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </button>
    )
}

export default BackButton
