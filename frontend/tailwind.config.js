/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors (existing)
        forest: {
          900: '#0E1411', // Background
          800: '#141C17', // Primary Surface
          700: '#1B261F', // Secondary Surface
          divider: '#223029',
        },
        accent: {
          DEFAULT: '#6FAF8A',
          hover: '#5A9675',
        },
        warning: '#C8A24A',
        text: {
          primary: '#E6ECE8',
          muted: '#9FB0A6',
        },
        
        // Light mode colors - Sophisticated Green Palette
        light: {
          50: '#F5FAF8', // Very light green background
          100: '#E8F5F0', // Light green surface
          200: '#D1E7DD', // Medium light green surface
          300: '#A7D4C4', // Light green accent surface
          400: '#6FAF8A', // Primary green accent
          500: '#10B981', // Main green color
          600: '#059669', // Darker green
          divider: '#B8D4C8', // Subtle green divider
        },
        'light-accent': {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#A7D4C4',
        },
        'light-text': {
          primary: '#1A3B2E', // Dark green text
          muted: '#4A6B5E', // Medium green text
          subtle: '#6B8B7E', // Light green text
        }
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'institutional': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}
