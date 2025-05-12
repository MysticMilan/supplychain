/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 0 15px rgba(255, 255, 255, 0.5)',
      },
    },
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'checkmark': 'checkmark 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        checkmark: {
          '0%': { strokeDashoffset: '50', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { strokeDashoffset: '0' }
        }
      }
    },
  },
  plugins: [],
}
