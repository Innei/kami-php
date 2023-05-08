const { addDynamicIconSelectors } = require('@iconify/tailwind')
const twColors = require('tailwindcss/colors')

const deprecatedColorKeyMap = {
  lightBlue: 'sky',
  warmGray: 'stone',
  trueGray: 'neutral',
  coolGray: 'gray',
  blueGray: 'slate',
}

const deprecatedColorKeys = Object.keys(deprecatedColorKeyMap)
for (const key of deprecatedColorKeys) {
  delete twColors[key]
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', 'html.dark'],
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 568px)' },
        desktop: { raw: '(min-width: 1100px)' },
        tablet: { raw: '(max-width: 1099px)' },
        wider: { raw: '(min-width: 1500px)' },

        w900: { raw: '(max-width: 900px)' },

        'w-screen': '100vw',
        'h-screen': '100vh',
      },
      maxWidth: {
        screen: '100vw',
      },
      width: {
        screen: '100vw',
      },
      height: {
        screen: '100vh',
      },
      maxHeight: {
        screen: '100vh',
      },
      fontFamily: {
        serif: 'var(--serif-font)',
        sans: 'var(--sans-font)',
        mono: 'var(--monospace-font)',
      },
      colors: {
        always: twColors,
        theme: {
          black: 'rgba(var(--black), <alpha-value>)',
          white: 'rgba(var(--white), <alpha-value>)',
          green: 'rgba(var(--green), <alpha-value>)',
          blue: 'rgba(var(--blue), <alpha-value>)',
          yellow: 'rgba(var(--yellow), <alpha-value>)',

          accent: 'rgba(var(--accent), <alpha-value>)',
          primary: 'rgba(var(--primary), <alpha-value>)',

          gray: {
            DEFAULT: 'rgba(var(--gray-4), <alpha-value>)',
            1: 'rgba(var(--gray-1), <alpha-value>)',
            2: 'rgba(var(--gray-2), <alpha-value>)',
            3: 'rgba(var(--gray-3), <alpha-value>)',
            4: 'rgba(var(--gray-4), <alpha-value>)',
            5: 'rgba(var(--gray-5), <alpha-value>)',
            6: 'rgba(var(--gray-6), <alpha-value>)',
          },

          text: 'rgba(var(--black), <alpha-value>)',
          bg: {
            DEFAULT: 'rgba(var(--white), <alpha-value>)',
            opacity: 'var(--bg-opacity)',
          },
        },
      },
    },
  },
  plugins: [
    addDynamicIconSelectors(),
    function ({ addUtilities }) {
      const styles = {
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.shadow-out-sm': {
          'box-shadow':
            '0 0 10px rgb(120 120 120 / 10%), 0 5px 20px rgb(120 120 120 / 20%)',
        },
      }
      addUtilities(styles)
    },
  ],
}
