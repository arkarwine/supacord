import TailwindScrollbar from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                // ----------
                // Light Theme

                primary: '#ffffff',
                'secondary-from': '#bfdbfe',
                'secondary-via': '#bae6fd',
                'secondary-to': '#a5f3fc',

                message: '#ffffff',
                'reply-message': '#dbeafe',

                'button-secondary': '#38bdf8',
                toast: '#3b82f6',

                'search-primary': '#e2e8f0',

                header: '#eff6ff',

                'context-menu': '#ffffff',

                muted: '#64748b',
                title: '#334155',
                'secondary-title': '#0f172a',

                // ----------
                // Dark Theme

                'dark-primary': '#374151',
                'dark-secondary-from': '#1f2937',
                'dark-secondary-via': '#0f172a',
                'dark-secondary-to': '#27272a',

                'dark-message': '#374151',
                'dark-reply-message': '#4b5563',

                'dark-button-secondary': '#2563eb',

                'dark-toast': '#2563eb',

                'dark-search-primary': '#1e293b',

                'dark-header': '#374151',

                'dark-context-menu': '#374151',

                'dark-muted': '#cbd5e1',
                'dark-title': '#ffffff',
                'dark-secondary-title': '#f1f5f9',

                // ------------
                // Misselaneous

                'hover-primary': '#80808020',
                'hover-secondary': '#ffffff20',
                'focus-txt': '#3b82f6',
            },
            screens: {
                '-md': { max: '768px' },
            },
            fontFamily: {
                roboto: 'Roboto',
            },
            keyframes: {
                'slide-in': {
                    from: {
                        transform: 'translateX(100%)',
                    },
                    to: {
                        transform: 'translateX(0%)',
                    },
                },
                'fade-in': {
                    from: {
                        opacity: '0',
                    },
                    to: {
                        opacity: '100',
                    },
                },
                'fade-out': {
                    from: {
                        opacity: '100',
                    },
                    to: {
                        opacity: '0',
                    },
                },
                'scale-in': {
                    from: {
                        scale: '0.9',
                    },
                    to: {
                        scale: '1',
                    },
                },
                'message-sent': {
                    from: {
                        backgroundColor: 'rgb(226 232 240)',
                    },
                    to: {
                        backgroundColor: 'rgb(239 246 255)',
                    },
                },
                'custom-pulse': {
                    '50%': {
                        opacity: '0.5',
                        scale: '0.8',
                    },
                },
            },
        },
    },
    plugins: [
        TailwindScrollbar,
        plugin(function ({ addBase }) {
            addBase({
                '[type="search"]::-webkit-search-decoration': { display: 'none' },
                '[type="search"]::-webkit-search-cancel-button': { display: 'none' },
                '[type="search"]::-webkit-search-results-button': { display: 'none' },
                '[type="search"]::-webkit-search-results-decoration': { display: 'none' },
            })
        }),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'animate-delay': (value) => ({
                        animationDelay: value,
                    }),
                },
                { values: theme('transitionDelay') },
            )
        }),
    ],
} satisfies Config
