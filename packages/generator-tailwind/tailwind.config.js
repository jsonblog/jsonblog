/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.hbs'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '18px',
        xs: '0.8125rem',     // 13px - tags/categories
        sm: '0.875rem',      // 14px - metadata
        lg: '1.125rem',      // 18px - descriptions
        xl: '1.25rem',       // 20px - h4
        '2xl': '1.75rem',    // 28px - h3
        '3xl': '2.25rem',    // 36px - h2
        '4xl': '3rem',       // 48px - site title
        '5xl': '3.5rem',     // 56px - h1/post title
      },
      colors: {
        burgundy: {
          DEFAULT: '#8B2635',
          dark: '#6D1E2A',
          light: '#A63646',
        },
        forest: {
          DEFAULT: '#2C5F4D',
          dark: '#1F4536',
          light: '#3A7A62',
        },
        golden: {
          DEFAULT: '#C79F5C',
          dark: '#A67F3E',
          light: '#D9B57A',
        },
        neutral: {
          50: '#FAFAF8',
          100: '#F5F3F0',
          200: '#E5E5E5',
          300: '#D1D1D1',
          400: '#A0A0A0',
          500: '#737373',
          600: '#4A4A4A',
          900: '#1A1A1A',
        },
      },
      maxWidth: {
        content: '720px',    // Narrower for better readability
        wide: '1100px',      // Wider container for grid layouts
      },
      lineHeight: {
        relaxed: '1.75',
        loose: '1.8',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.05em',
        wider: '0.08em',
        widest: '0.1em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
