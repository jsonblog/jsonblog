import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#0066cc',
      },
    },
  },
  plugins: [],
};

export default config;
