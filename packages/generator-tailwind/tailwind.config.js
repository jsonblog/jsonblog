/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.hbs'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        base: '19px',
      },
      maxWidth: {
        content: '816px',
      },
      lineHeight: {
        relaxed: '1.75',
      },
    },
  },
  plugins: [],
};
