// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ["./app/view/**/*.phtml"],
  theme: {
    screens: {
      "xs": '360px',
      "sm": '480px',
      "md": '768px',
      "lg": '976px',
      "xl": '1280px',
      "2xl": '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
