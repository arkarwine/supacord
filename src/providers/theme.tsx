import React, { createContext, useState } from 'react'

interface ThemeType {
    theme: 'dark' | 'light'
    toggleTheme(): void
}

export const ThemeContext = createContext<ThemeType | null>(null)

function ThemeProvider({ children }: React.PropsWithChildren) {
    const [theme, setTheme] = useState<'dark' | 'light'>(localStorage.getItem('theme') === 'light' ? 'light' : 'dark')
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        setTheme(newTheme)
    }
    const className = theme + ' h-full w-full'
    console.log(className)
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={className}>{children}</div>
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
