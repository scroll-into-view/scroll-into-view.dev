import cx from 'classnames'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView, {
  type CustomScrollBehaviorCallback,
} from 'scroll-into-view-if-needed'
import Code from './Code'
import * as Example from './Example'
import Select from './Select'

import styles from './ExampleCustomTransition.module.css'

const emojis = ['🌎', '🌍', '🌏']

type Inline = 'center' | 'nearest'

/**
 * Shared demo for passing a function to `behavior`, the examples only differ
 * in the source code shown and how the scrolling is animated.
 */
function CustomTransition({
  imports,
  source,
  behavior,
}: {
  /** import statements shown at the top of the example source */
  imports: string
  /** the source code of `behavior`, as shown in the example */
  source: string
  behavior: CustomScrollBehaviorCallback
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inline, setInline] = useState<Inline>('center')

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollLeft = 200
  }, [])

  const SourceCode = useMemo(
    () => `
  import scrollIntoView from 'scroll-into-view-if-needed'
  ${imports}

  scrollIntoView(node, {
    behavior: ${source},
    inline: ${JSON.stringify(inline)},
  })
  `,
    [imports, source, inline]
  )

  return (
    <Example.Section>
      <Example.Code>
        <Example.CodeHeader>
          <Select
            label="Inline"
            onChange={(event) => setInline(event.target.value)}
            value={inline}
          >
            <option value="center">Center</option>
            <option value="nearest">Nearest</option>
          </Select>
        </Example.CodeHeader>
        <Example.CodeBody>
          <Code value={SourceCode} />
        </Example.CodeBody>
      </Example.Code>
      <Example.Result>
        <Example.ResultHeader>
          <span>Scroll to&nbsp;</span>
          {emojis.map((emoji, key) => (
            <Example.Button
              key={emoji}
              onClick={() => {
                const container = containerRef.current
                const target = container?.querySelector(`[data-key="${key}"]`)
                if (!container || !target) return
                scrollIntoView(target, {
                  behavior,
                  boundary: container,
                  inline,
                })
              }}
            >
              {emoji}
            </Example.Button>
          ))}
        </Example.ResultHeader>
        <Example.ScrollContainer ref={containerRef}>
          <div className={styles.scrollLayer}>
            {emojis.map((emoji, key) => (
              <div
                key={emoji}
                className={cx(styles.item, 'is-size-1')}
                data-key={key}
              >
                {emoji}
              </div>
            ))}
          </div>
        </Example.ScrollContainer>
      </Example.Result>
    </Example.Section>
  )
}

export default memo(CustomTransition)
