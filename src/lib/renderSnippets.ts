import { codeToHtml } from '@pierre/highlights'
import dracula from '@pierre/highlights/themes/dracula'
import { format } from 'vite-plus/fmt'

import {
  snippetKey,
  type SnippetExample,
  type Snippets,
} from '../components/snippets'

const decoder = new TextDecoder()

/**
 * Formats every variant of an example's snippet with oxfmt and highlights it
 * with Pierre. Runs at build time only, so neither the formatter (a native
 * Node module) nor the highlighter's WASM ends up in the browser bundle.
 */
export async function renderSnippets<Options extends Record<string, unknown>>(
  example: SnippetExample<Options>
): Promise<Snippets> {
  const entries = await Promise.all(
    example.variants.map(async (options) => {
      const { code, errors } = await format(
        'snippet.js',
        example.source(options),
        {
          // Narrow enough to fit on phones without horizontal scrolling
          printWidth: 40,
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
        }
      )
      if (errors.length) {
        throw new Error(
          `Failed to format snippet for ${snippetKey(options)}:\n${errors
            .map((error) => error.codeframe ?? error.message)
            .join('\n')}`
        )
      }
      return [snippetKey(options), code.trimEnd()] as const
    })
  )
  return Object.fromEntries(
    entries.map(([key, code]) => [
      key,
      // codeToHtml returns bytes that the next call may overwrite, so decode
      // them right away
      decoder.decode(codeToHtml(code, { lang: 'javascript', theme: dracula })),
    ])
  )
}
