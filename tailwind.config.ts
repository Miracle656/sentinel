import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'sui-blue': '#298dff',
                'sui-blue-bright': '#3C9AFB',
                'sui-deep': '#000000',
                'sui-navy': '#0A0F1E',
                'sui-card': '#0F1419',
            },
            fontFamily: {
                sans: ['TWKEverett', 'Arial', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            },
            boxShadow: {
                'glow-sm': '0 0 16px rgba(41, 141, 255, 0.3)',
                'glow': '0 0 24px rgba(41, 141, 255, 0.4)',
                'glow-lg': '0 0 32px rgba(41, 141, 255, 0.6)',
                'glow-red': '0 0 24px rgba(239, 68, 68, 0.4)',
                'glow-green': '0 0 24px rgba(16, 185, 129, 0.4)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
                'gradient-radial-top': 'radial-gradient(ellipse 80% 50% at 50% -20%, var(--tw-gradient-stops))',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(41, 141, 255, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(41, 141, 255, 0.6)' },
                },
            },
            // Sharp edges - no border radius
            borderRadius: {
                none: '0',
                DEFAULT: '0',
            },
        },
    },
    plugins: [],
} satisfies Config;
