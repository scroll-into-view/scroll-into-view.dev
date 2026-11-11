import cx from 'classnames'
import { animate } from 'popmotion'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import Styler from 'stylefire'
import Code from './Code'
import * as Example from './Example'
import Select from './Select'

import styles from './ExampleOverrideBehavior.module.css'

const emojis = ['🌎', '🌍', '🌏']

function Boundary() {
  const containerRef = useRef<HTMLElement>(null)
  const [inline, setInline] = useState<'center' | 'nearest'>('center')

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollLeft = 200
  }, [])

  const SourceCode = useMemo(
    () => `
  import scrollIntoView from 'scroll-into-view-if-needed';
  import Styler from 'stylefire'
  import { animate } from 'popmotion'

  scrollIntoView(node, {behavior: instructions => {
    const [{ el, left }] = instructions
      const styler = Styler(el)

      animate({from: el.scrollLeft,to: left, type: 'spring', onUpdate: left => styler.set('scrollLeft', left)})
      
      
    },inline: ${JSON.stringify(inline)}})
  `,
    [inline]
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
                  behavior: (instructions) => {
                    const [{ el, left }] = instructions
                    const styler = Styler(el as HTMLElement, {})

                    animate({
                      from: el.scrollLeft,
                      to: left,
                      type: 'spring',
                      onUpdate: (left) => styler.set('scrollLeft', left),
                    })
                  },
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

export default memo(Boundary)
