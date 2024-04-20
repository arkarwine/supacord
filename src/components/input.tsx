import React, { forwardRef } from 'react'

type Props = {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    className?: string
    placeholder?: string
    disabled?: boolean
    name?: string
    required?: boolean
    value?: string
    pattern?: string
    maxLength?: number
}

const Input = forwardRef<HTMLInputElement, Props>(
    ({ required, name, disabled, onChange, className = '', placeholder, value, pattern, maxLength }, ref) => {
        return (
            <div
                className={
                    'group relative flex flex-row-reverse center rounded-lg h-12 border-[1px] border-slate-400 hover:border-blue-400 has-[:focus]:border-blue-400 has-[:focus]:border-[2px] ' +
                    className
                }
            >
                <input
                    ref={ref}
                    pattern={pattern}
                    value={value}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    maxLength={maxLength}
                    type="text"
                    className="h-full pl-3 peer basis-full outline-none z-10 bg-transparent rounded-lg"
                    placeholder=" "
                    name={name}
                />
                <label
                    htmlFor={name}
                    className="transition-all ease-in-out left-3 pointer-events-none text-muted dark:text-dark-muted absolute peer-[:not(:placeholder-shown)]:translate-y-[-1.5rem] peer-[:not(:placeholder-shown)]:text-xs group-hover:text-focus-txt peer-focus:text-focus-txt bg-primary peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:translate-x-[-0.5rem] peer-focus:translate-x-[-0.5rem] peer-focus:translate-y-[-1.5rem] peer-focus:text-xs peer-focus:px-1"
                >
                    {placeholder}
                </label>
            </div>
        )
    },
)

export default Input
