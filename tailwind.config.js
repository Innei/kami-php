module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',

  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 768px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1023px)' },
      },
      colors: {
        background: {
          default: '#F3F5F9',
          gray: '#9e9ea7',
        },
        primary: {
          default: '#0A2871',
        },
        theme: {
          blue: { shallow: '#BEDCFA', primary: '#98ACF8' },
          purple: { deep: '#B088F9', primary: '#DA9FF9' },
          green: { shallow: '#C1FFD7' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
