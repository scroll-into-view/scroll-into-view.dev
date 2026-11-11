import { format } from 'vite-plus/fmt'

import {
  snippetKey,
  type SnippetExample,
  type Snippets,
} from '../components/snippets'

/**
 * Formats every variant of an example's snippet with oxfmt. Runs at build
 * time only: the formatter is a native Node module and can't be bundled for browsers.
 */
export async function formatSnippets<Options extends Record<string, unknown>>(
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
  return Object.fromEntries(entries)
}
