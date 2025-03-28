/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-dark': '#4338CA',
        background: '#0a0a16',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'grid-fade': 'grid-fade 8s linear infinite',
        'grid-glow': 'grid-glow 4s ease-in-out infinite',
        pulse: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        'grid-fade': {
          '0%': {
            'background-position': '0% 0%',
          },
          '100%': {
            'background-position': '50px 50px',
          },
        },
        'grid-glow': {
          '0%, 100%': {
            'background-image': 'linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(124,58,237,0.1)_1px,transparent_1px)',
          },
          '50%': {
            'background-image': 'linear-gradient(90deg,rgba(30,58,138,0.15)_1px,transparent_1px),linear-gradient(0deg,rgba(30,58,138,0.15)_1px,transparent_1px)',
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: 0.3,
            transform: "scale(1)",
          },
          "50%": {
            opacity: 0.5,
            transform: "scale(1.1)",
          },
        },
      },
    },
  },
  plugins: [],
}