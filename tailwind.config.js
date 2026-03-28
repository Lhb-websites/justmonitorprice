/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enables dark mode via 'dark' class on html element
  theme: {
    extend: {
      // Custom color palette optimized for price monitoring
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main brand blue
          600: '#0284c8',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          500: '#22c55e', // Green for price drops / positive change
          600: '#16a34a',
        },
        danger: {
          500: '#ef4444', // Red for price increases / alerts
          600: '#dc2626',
        },
        neutral: {
          800: '#1f2937',
          900: '#111827',
        },
        // Accent for highlights (e.g., alerts, popular products)
        accent: '#eab308', // Warm yellow/gold
      },

      // Font family - clean and modern (Inter is excellent for dashboards)
      fontFamily: {
        sans: ['Inter', 'system_ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'], // Good for prices & data
      },

      // Enhanced spacing for dashboard layouts
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // Border radius for modern cards
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },

      // Box shadows for cards and panels
      boxShadow: {
        'soft': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'card': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'dashboard': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      // Animation utilities for price changes (pulse, bounce for alerts)
      animation: {
        'price-up': 'priceUp 0.4s ease-out',
        'price-down': 'priceDown 0.4s ease-out',
        'alert-pulse': 'alertPulse 2s infinite',
      },

      keyframes: {
        priceUp: {
          '0%': { transform: 'translateY(-4px)', color: '#22c55e' },
          '100%': { transform: 'translateY(0)', color: 'inherit' },
        },
        priceDown: {
          '0%': { transform: 'translateY(4px)', color: '#ef4444' },
          '100%': { transform: 'translateY(0)', color: 'inherit' },
        },
        alertPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [
    // Optional: Add these popular plugins if you install them
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
}
