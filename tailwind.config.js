/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sky-primary': '#4da6ff',
        'sky-secondary': '#87CEEB',
        'gray-primary': '#808080',
        'gray-secondary': '#E0E0E0',
        'navy-700': '#1E3A8A',
        'navy-800': '#172554',
        'navy-900': '#0F172A',
      },
      animation: {
        'fadeRightIn': 'fadeRightIn 0.5s ease-out',
        'fadeLeftIn': 'fadeLeftIn 0.5s ease-out',
        'slideDown': 'slideDown 0.3s ease-out',
        'pulse': 'pulse 1.5s ease-in-out infinite',
        // 새로 추가된 애니메이션
        'scale-up': 'scaleUp 0.3s ease-out',
        'background-fade': 'backgroundFade 0.3s ease-out',
      },
      keyframes: {
        fadeRightIn: {
          '0%': { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeLeftIn: {
          '0%': { opacity: 0, transform: 'translateX(10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        // 새로 추가된 키프레임
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        backgroundFade: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}