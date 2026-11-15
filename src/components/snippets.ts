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
      .toSorted()
      .map((key) => [key, options[key]])
  )
}

/** Every combination of the given option values */
function combinations<Options extends Record<string, unknown>>(values: {
  [K in keyof Options]: readonly Options[K][]
}): Options[] {
  const entries: [string, readonly unknown[]][] = Object.entries(values)
  let variants: Record<string, unknown>[] = [{}]
  for (const [key, options] of entries) {
    variants = variants.flatMap((variant) =>
      options.map((value) => Object.assign({}, variant, { [key]: value }))
    )
  }
  // Each variant gets one of the listed values for every key of `values`
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return variants as Options[]
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
  source: ({ block, boundary: withBoundary }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'

    scrollIntoView(node, {
      behavior: 'smooth',
      block: '${block}',
      ${withBoundary ? "boundary: document.getElementById('example-boundary')" : ''}
    })
  `,
}

const customTransitionVariants = combinations<{
  inline: 'center' | 'nearest'
}>({ inline: ['center', 'nearest'] })

export const motionTransition: SnippetExample<{
  inline: 'center' | 'nearest'
}> = {
  initial: { inline: 'center' },
  variants: customTransitionVariants,
  source: ({ inline }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'
    import { animate } from 'motion'

    scrollIntoView(node, {
      behavior: (actions) =>
        actions.forEach(({ el, top, left }) => {
          animate(el.scrollTop, top, {
            type: 'spring',
            bounce: 0.3,
            onUpdate: (value) => (el.scrollTop = value),
          })
          animate(el.scrollLeft, left, {
            type: 'spring',
            bounce: 0.3,
            onUpdate: (value) => (el.scrollLeft = value),
          })
        }),
      inline: ${JSON.stringify(inline)},
    })
  `,
}

export const elAnimateTransition: SnippetExample<{
  inline: 'center' | 'nearest'
}> = {
  initial: { inline: 'center' },
  variants: customTransitionVariants,
  source: ({ inline }) => `
    import scrollIntoView from 'scroll-into-view-if-needed'
    // No library needed, it's built in

    scrollIntoView(node, {
      behavior: (actions) =>
        actions.forEach(({ el, top, left }) => {
          const content = el.firstElementChild
          const dx = left - el.scrollLeft
          const dy = top - el.scrollTop
          // Jump to the new position, then
          // animate from the old one (FLIP)
          el.scroll({ top, left, behavior: 'instant' })
          content.animate(
            [
              { transform: \`translate(\${dx}px, \${dy}px)\` },
              { transform: 'none' },
            ],
            { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
          )
        }),
      inline: ${JSON.stringify(inline)},
    })
  `,
}
