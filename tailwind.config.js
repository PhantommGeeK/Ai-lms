/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: {
          primary: '#0f1117',
          secondary: '#161822',
          tertiary: '#1e2030',
          card: 'rgba(30, 32, 48, 0.7)',
          sidebar: '#12141e',
        },
        accent: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          violet: '#a78bfa',
          indigo: '#6d28d9',
        },
        text: {
          primary: '#e8eaed',
          secondary: '#9aa0b8',
          muted: '#5d6380',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.15), 0 0 40px rgba(59, 130, 246, 0.08)',
        'glow-lg': '0 0 30px rgba(124, 58, 237, 0.25), 0 0 60px rgba(59, 130, 246, 0.12)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.03)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed, #3b82f6)',
        'gradient-accent': 'linear-gradient(135deg, #6d28d9, #2563eb)',
        'gradient-glow': 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.2))',
      },
    },
  },
  plugins: [require("rippleui")],
};
