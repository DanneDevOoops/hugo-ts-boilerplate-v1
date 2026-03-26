const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'assets/css/**/*.{ts,html,css,scss}',
    'assets/css/ts/services/tailwindMixin.ts'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    plugin(function (
      {
        addUtilities,
        matchUtilities,
        addComponents,
        matchComponents,
        addBase,
        addVariant,
        matchVariant,
        theme,
        config,
        corePlugins,
        e,
      }
    ) {
      // Add your custom styles here
    }),
  ],
};
