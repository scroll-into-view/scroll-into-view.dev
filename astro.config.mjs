// @ts-check
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://scroll-into-view.dev',
  integrations: [react()],
})
