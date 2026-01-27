/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Core Background Colors
                void: '#030305',
                obsidian: '#0a0a0f',
                onyx: '#12121a',
                slate: '#1a1a25',
                graphite: '#252530',

                // Cyan Accent
                cyan: {
                    glow: '#00D9FF',
                    bright: '#00F0FF',
                    DEFAULT: '#00D9FF',
                    dim: '#0099B3',
                    muted: '#006680',
                },

                // Magenta Accent
                magenta: {
                    glow: '#FF00E5',
                    bright: '#FF33EC',
                    DEFAULT: '#FF00E5',
                    dim: '#B300A3',
                    muted: '#660066',
                },

                // Gold Accent
                gold: {
                    glow: '#FFD700',
                    bright: '#FFDF33',
                    DEFAULT: '#FFD700',
                    dim: '#B39700',
                    muted: '#665600',
                },

                // Status Colors
                success: {
                    DEFAULT: '#00FF88',
                    dim: '#00B360',
                },
                error: {
                    DEFAULT: '#FF3366',
                    dim: '#CC2952',
                },
                warning: {
                    DEFAULT: '#FFAA00',
                    dim: '#CC8800',
                },

                // Legacy compatibility (for existing code)
                primary: {
                    50: '#e6fcff',
                    100: '#b3f5ff',
                    200: '#80eeff',
                    300: '#4de7ff',
                    400: '#1ae0ff',
                    500: '#00D9FF',
                    600: '#00adc9',
                    700: '#008199',
                    800: '#005566',
                    900: '#002933',
                    950: '#001519',
                },
                accent: {
                    50: '#ffe6fc',
                    100: '#ffb3f5',
                    200: '#ff80ee',
                    300: '#ff4de7',
                    400: '#ff1ae0',
                    500: '#FF00E5',
                    600: '#cc00b7',
                    700: '#990089',
                    800: '#66005c',
                    900: '#33002e',
                    950: '#190017',
                },
            },
            fontFamily: {
                display: ['Outfit', 'system-ui', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
                '10xl': ['10rem', { lineHeight: '1' }],
                '11xl': ['12rem', { lineHeight: '1' }],
                '12xl': ['14rem', { lineHeight: '1' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-down': 'slideDown 0.5s ease-out forwards',
                'slide-left': 'slideLeft 0.5s ease-out forwards',
                'slide-right': 'slideRight 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.4s ease-out forwards',
                'spin-slow': 'spin 8s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 2s infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient': 'gradientShift 8s linear infinite',
                'border-dance': 'borderDance 4s ease-in-out infinite',
                'typing': 'typing 1.4s infinite ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideLeft: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseGlow: {
                    '0%, 100%': {
                        opacity: '0.5',
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
                    },
                    '50%': {
                        opacity: '1',
                        boxShadow: '0 0 40px rgba(0, 217, 255, 0.4)',
                    },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                borderDance: {
                    '0%, 100%': { borderColor: '#00D9FF' },
                    '50%': { borderColor: '#FF00E5' },
                },
                typing: {
                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
                    '40%': { transform: 'scale(1.2)', opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'mesh-gradient': `
                    radial-gradient(at 40% 20%, rgba(0, 217, 255, 0.08) 0px, transparent 50%),
                    radial-gradient(at 80% 0%, rgba(255, 0, 229, 0.06) 0px, transparent 50%),
                    radial-gradient(at 0% 50%, rgba(0, 217, 255, 0.05) 0px, transparent 50%),
                    radial-gradient(at 80% 50%, rgba(255, 0, 229, 0.05) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, rgba(0, 217, 255, 0.08) 0px, transparent 50%),
                    radial-gradient(at 80% 100%, rgba(255, 0, 229, 0.05) 0px, transparent 50%)
                `,
            },
            boxShadow: {
                'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.15), 0 0 40px rgba(0, 217, 255, 0.1), 0 0 60px rgba(0, 217, 255, 0.05)',
                'glow-cyan-lg': '0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(0, 217, 255, 0.15), 0 0 90px rgba(0, 217, 255, 0.1)',
                'glow-magenta': '0 0 20px rgba(255, 0, 229, 0.15), 0 0 40px rgba(255, 0, 229, 0.1), 0 0 60px rgba(255, 0, 229, 0.05)',
                'glow-magenta-lg': '0 0 30px rgba(255, 0, 229, 0.2), 0 0 60px rgba(255, 0, 229, 0.15), 0 0 90px rgba(255, 0, 229, 0.1)',
                'glow-gold': '0 0 20px rgba(255, 215, 0, 0.15), 0 0 40px rgba(255, 215, 0, 0.1), 0 0 60px rgba(255, 215, 0, 0.05)',
                'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.1)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.25), 0 0 1px rgba(255, 255, 255, 0.1)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.15), 0 0 40px rgba(0, 217, 255, 0.05)',
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionDuration: {
                '400': '400ms',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
        },
    },
    plugins: [],
};
