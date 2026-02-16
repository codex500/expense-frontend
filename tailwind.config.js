/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#22C55E',
        accent: '#F59E0B',
        dark: '#0F172A',
        light: '#F8FAFC',
      },
      borderRadius: { card: '16px' },
      fontFamily: { sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'] },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0,0,0,0.1)',
        'glass-dark': '0 8px 32px 0 rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'gradient-nav': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [],
};
