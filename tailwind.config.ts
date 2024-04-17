import TailwindScrollbar from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
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
