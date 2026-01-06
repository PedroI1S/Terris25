/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html",
    "src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006b3c',
          50: '#e6f5ed',
          100: '#b3dfcd',
          200: '#80c9ad',
          300: '#4db38d',
          400: '#1a9d6d',
          500: '#006b3c',
          600: '#00572f',
          700: '#004322',
          800: '#002f15',
          900: '#001b08',
        },
        secondary: {
          DEFAULT: '#b56a2a',
          50: '#f9ede1',
          100: '#f0d8c3',
          200: '#e4b896',
          300: '#d89869',
          400: '#cc803c',
          500: '#b56a2a',
          600: '#945521',
          700: '#734119',
          800: '#522d11',
          900: '#311909',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0f1724',
          light: '#f9fafb', // using 50
          mid: '#64748b',   // using 600? or defined separately
          dark: '#0f1724',  // using 950
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      spacing: {
        base: '8px',
      },
    },
  },
  plugins: [],
}
