import React from 'react'

type Props = {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    className?: string
    isLoading?: boolean
}

function Search({ onChange, className = '', isLoading = false }: Props) {
    return (
        <form
            className={'relative flex justify-center items-center rounded-lg bg-slate-200 ' + className}
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                onChange={onChange}
                autoComplete="off"
                dir="auto"
                type="search"
                placeholder="Search"
                className="peer order-1 h-full basis-full border-none bg-transparent pb-[0.88px] outline-none"
                size={1}
            />
            {isLoading ? (
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[1.5rem] basis-[48px] fill-none stroke-blue-500 transition-all"
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
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="h-[1rem] basis-[48px] fill-none stroke-slate-400 transition-all peer-focus:stroke-blue-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            )}
        </form>
    )
}

export default Search
