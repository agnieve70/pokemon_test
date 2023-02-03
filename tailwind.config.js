/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                bounce: {
                    '0%, 100%': {
                        'transform': 'translateY(-5%)',
                        'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
                    },
                    '50%': {
                        transform: 'none',
                        'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
                    }
                }
            },
            animation: {
                'spin-slow':
                    'spin 3s linear infinite',
                'bounce-slow':
                    'bounce 3s ease-in-out  infinite'
            }
        },
    },
    plugins: [],
}
