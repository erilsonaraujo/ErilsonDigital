/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./data/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'class',
    safelist: [
        {
            pattern: /(bg|text|border)-(blue|primary|emerald|indigo|slate|rose|amber)-500/,
        },
        {
            pattern: /bg-(blue|primary|emerald|indigo|slate|rose|amber)-500\/(5|10)/,
        },
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-manrope)', 'sans-serif'],
                display: ['var(--font-space-grotesk)', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eef3ff',
                    100: '#dce6ff',
                    200: '#b7c9ff',
                    300: '#87a4ff',
                    400: '#5a7dff',
                    500: '#2f55ff',
                    600: '#1d3ee6',
                    700: '#1632b7',
                    800: '#132a8f',
                    900: '#0f236f',
                    950: '#0b1a55',
                },
                secondary: {
                    500: '#1cc9a7',
                    600: '#0fa685',
                },
                ink: {
                    950: '#0a0c10',
                    900: '#0f131a',
                    800: '#151c26',
                    700: '#1d2633',
                    600: '#263244',
                },
                graphite: {
                    50: '#f6f7f9',
                    100: '#eaecf0',
                    200: '#d6dae1',
                    300: '#b7bfcc',
                    400: '#919aad',
                    500: '#6b7487',
                    600: '#4c5466',
                    700: '#353c4c',
                    800: '#232835',
                    900: '#151924',
                },
                cobalt: {
                    50: '#eef3ff',
                    100: '#dce6ff',
                    200: '#b7c9ff',
                    300: '#87a4ff',
                    400: '#5a7dff',
                    500: '#2f55ff',
                    600: '#1d3ee6',
                    700: '#1632b7',
                    800: '#132a8f',
                    900: '#0f236f',
                },
                tide: {
                    50: '#ecfdf9',
                    100: '#d2fbf1',
                    200: '#a9f5e3',
                    300: '#76ecd1',
                    400: '#40d9bc',
                    500: '#1cc9a7',
                    600: '#0fa685',
                    700: '#0c826a',
                    800: '#0b6554',
                    900: '#0a4f44',
                },
                ember: {
                    50: '#fff3ed',
                    100: '#ffe2d4',
                    200: '#ffc0a8',
                    300: '#ff936f',
                    400: '#ff6b3d',
                    500: '#ff4a1f',
                    600: '#e53112',
                    700: '#b8250e',
                    800: '#921f10',
                    900: '#741d12',
                }
                ,
                dark: {
                    800: '#1d2633',
                    900: '#0f131a',
                    950: '#0a0c10',
                },
            },
            animation: {
                'float-slow': 'float-slow 12s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 6s ease-in-out infinite',
                'fade-up': 'fade-up 700ms ease forwards',
                'fade-in': 'fade-in 700ms ease forwards',
                'marquee': 'marquee 18s linear infinite',
            },
            keyframes: {
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-16px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                },
                'fade-up': {
                    '0%': { opacity: 0, transform: 'translateY(16px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            }
        },
    },
    plugins: [],
}
