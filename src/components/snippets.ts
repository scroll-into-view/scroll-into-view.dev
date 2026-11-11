/**
 * Source code shown next to each example. Every combination of options is
 * listed up front so `Code.astro` can format and highlight all of them at
 * build time (see `src/lib/renderSnippets.ts`).
 */

/** Highlighted snippet HTML, keyed by `snippetKey(options)` */
export type Snippets = Record<string, string>

export interface SnippetExample<Options extends Record<string, unknown>> {
  /** The options the example starts out with */
  initial: Options
  variants: Options[]
  source: (options: Options) => string
}

/** A stable key for a set of options, regardless of property order */
export function snippetKey(options: Record<string, unknown>): string {
  return JSON.stringify(
    Object.keys(options)
      .sort()
      .map((key) => [key, options[key]])
  )
}

/** Every combination of the given option values */
function combinations<Options extends Record<string, unknown>>(values: {
  [K in keyof Options]: readonly Options[K][]
}): Options[] {
  return Object.entries(values).reduce<Record<string, unknown>[]>(
    (acc, [key, options]) =>
      acc.flatMap((variant) =>
        (options as unknown[]).map((value) => ({ ...variant, [key]: value }))
      ),
    [{}]
  ) as Options[]
}

const blocks = ['start', 'center', 'end', 'nearest'] as const

export const ifNeeded: SnippetExample<{
  selectedBehavior: 'smooth-ponyfill' | 'smooth' | 'auto'
  scrollMode: 'if-needed' | 'always'
}> = {
  initial: { selectedBehavior: 'smooth-ponyfill', scrollMode: 'if-needed' },
  variants: combinations({
    selectedBehavior: ['smooth-ponyfill', 'smooth', 'auto'],
    scrollMode: ['if-needed', 'always'],
  }),
  source: ({ selectedBehavior, scrollMode }) => {
    const ponyfill = selectedBehavior === 'smooth-ponyfill'
    const behavior = ponyfill ? 'smooth' : selectedBehavior
    return `
      import scrollIntoView from '${
        ponyfill ? 'smooth-' : ''
      }scroll-into-view-if-needed'

      scrollIntoView(node, ${JSON.stringify({ behavior, scrollMode })})
    `
  },
}

export const alignment: SnippetExample<{
  block: (typeof blocks)[number]
  inline: (typeof blocks)[number]
}> = {
  initial: { block: 'center', inline: 'center' },
  variants: combinations({ block: blocks, inline: blocks }),
  source: ({ block, inline }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'

    scrollIntoView(node, ${JSON.stringify({
      behavior: 'smooth',
      block,
      inline,
    })})
  `,
}

export const boundary: SnippetExample<{
  block: (typeof blocks)[number]
  boundary: boolean
}> = {
  initial: { block: 'end', boundary: true },
  variants: combinations({ block: blocks, boundary: [true, false] }),
  source: ({ block, boundary }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'

    scrollIntoView(node, {
      behavior: 'smooth',
      block: '${block}',
      ${boundary ? "boundary: document.getElementById('example-boundary')" : ''}
    })
  `,
}

export const overrideBehavior: SnippetExample<{
  inline: 'center' | 'nearest'
}> = {
  initial: { inline: 'center' },
  variants: combinations({ inline: ['center', 'nearest'] }),
  source: ({ inline }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'
    import Styler from 'stylefire'
    import { animate } from 'popmotion'

    scrollIntoView(node, {
      behavior: (instructions) => {
        const [{ el, left }] = instructions
        const styler = Styler(el)

        animate({
          from: el.scrollLeft,
          to: left,
          type: 'spring',
          onUpdate: (left) => styler.set('scrollLeft', left),
        })
      },
      inline: ${JSON.stringify(inline)},
    })
  `,
}
