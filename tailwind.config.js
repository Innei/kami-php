module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  // important: true, // important in prod is must be

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
        red: 'var(--red)',
        yellow: 'var(--yellow)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        brown: 'var(--brown)',
        'light-brown': 'var(--light-brown)',
        purple: 'var(--purple)',
        'light-bg': 'var(--light-bg)',
        'light-font': 'var(--light-font)',
        'bg-opacity': 'var(--bg-opacity)',
        gray: 'var(--gray)',
        shallow: 'var(--shallow)',
        shizuku: {
          text: 'var(--shizuku-text-color)',
          theme: 'var(--shizuku-theme-color)',
          bg: 'var(--shizuku-background-color)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
