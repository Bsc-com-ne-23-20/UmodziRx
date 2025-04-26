module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e40af'
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a'
        },
        text: {
          DEFAULT: '#1e293b',
          dark: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}