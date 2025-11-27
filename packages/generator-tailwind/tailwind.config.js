/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.hbs', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Clash Grotesk (if self-hosted), fallback to Archivo from Google Fonts
        headline: ['"Clash Grotesk"', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        base: '18px',  // 1.125rem
        xs: '0.75rem',      // 12px - system labels
        sm: '0.8125rem',    // 13px - timestamps, nav
        lg: '1.1875rem',    // 19px - emphasized body
        xl: '1.25rem',      // 20px - h4
        '2xl': '1.75rem',   // 28px - h3
        '3xl': '2.25rem',   // 36px - h2
        '4xl': '3rem',      // 48px - site title
        '5xl': '3.5rem',    // 56px - post title
      },
      colors: {
        // Dark "ink" backgrounds
        ink: {
          900: '#0A0B0D',  // Deepest - body background
          800: '#12151A',  // Cards, elevated surfaces
          700: '#1C2028',  // Hover states
          600: '#252A35',  // Borders (visible)
          500: '#3A4157',  // Subtle borders
          400: '#4A5264',  // Disabled text
        },
        // Soft "chalk" text
        chalk: {
          100: '#F8F9FA',  // Primary text
          200: '#E9ECEF',  // Secondary text
          300: '#CED4DA',  // Tertiary text
          400: '#ADB5BD',  // Metadata text
          500: '#868E96',  // Subtle text
          600: '#495057',  // Barely visible
        },
        // Minimal accent colors
        accent: {
          blue: '#60A5FA',    // Links only
          cyan: '#22D3EE',    // Rare highlights
          green: '#34D399',   // Success states
          orange: '#FB923C',  // Warnings (rare)
        },
      },
      maxWidth: {
        content: '960px',   // Single-column reading
        wide: '1000px',     // Grid layouts
      },
      lineHeight: {
        relaxed: '1.7',
        loose: '1.8',
      },
      letterSpacing: {
        tightest: '-0.03em',  // Large headlines
        tighter: '-0.02em',   // Medium headlines
        normal: '0',          // Body text
        wide: '0.03em',       // Mono timestamps
        wider: '0.08em',      // Mono nav
        widest: '0.1em',      // Mono tags
      },
      backgroundImage: {
        'blueprint-grid': 'linear-gradient(rgba(96, 165, 250, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
        'grid-64': '64px 64px',
      },
    },
  },
  plugins: [],
};
