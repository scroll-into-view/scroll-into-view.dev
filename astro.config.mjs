// @ts-check
import react from '@astrojs/react'
import purgeCSSPlugin from '@fullhuman/postcss-purgecss'
import { defineConfig } from 'astro/config'

/**
 * The page only uses a handful of Bulma's classes, so the rest of the
 * framework is stripped at build time. Only Bulma is purged, the site's own
 * stylesheets are small and are left untouched.
 * @returns {import('postcss').Plugin}
 */
function purgeBulma() {
  const purge = purgeCSSPlugin({
    content: ['./src/**/*.{astro,ts,tsx}'],
    // Elements that are rendered by dependencies (the syntax highlighter),
    // and thus never appear as markup in ./src
    safelist: ['html', 'body', 'pre', 'code', 'span'],
  })
  return {
    postcssPlugin: 'purge-bulma',
    OnceExit(root, helpers) {
      return root.source?.input.file?.includes('/node_modules/bulma/')
        ? // @ts-expect-error -- delegating to the wrapped plugin
          purge.OnceExit(root, helpers)
        : undefined
    },
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://scroll-into-view.dev',
  integrations: [react()],
  build: {
    // After purging Bulma the CSS is small enough to ship inside the HTML,
    // which avoids a render-blocking stylesheet request
    inlineStylesheets: 'always',
  },
  vite: {
    css: {
      postcss: { plugins: [purgeBulma()] },
    },
  },
})
