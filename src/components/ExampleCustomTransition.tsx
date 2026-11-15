import cx from 'classnames'
import { memo, useEffect, useRef, useState } from 'react'
import scrollIntoView, {
  type CustomScrollBehaviorCallback,
} from 'scroll-into-view-if-needed'
import * as Example from './Example'
import Select from './Select'
import { snippetKey } from './snippets'

import styles from './ExampleCustomTransition.module.css'

const emojis = ['🌎', '🌍', '🌏']

type Inline = 'center' | 'nearest'

/**
 * Shared demo for passing a function to `behavior`, the examples only differ
 * in how the scrolling is animated and the snippet shown (`children`, rendered
 * by `Code.astro`).
 */
function CustomTransition({
  behavior,
  initialInline,
  children,
}: {
  behavior: CustomScrollBehaviorCallback
  initialInline: Inline
  children?: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inline, setInline] = useState<Inline>(initialInline)

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollLeft = 200
  }, [])

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
        <Example.CodeBody snippet={snippetKey({ inline })}>
          {children}
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
