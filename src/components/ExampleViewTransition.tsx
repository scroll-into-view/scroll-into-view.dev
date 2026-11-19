import cx from 'classnames'
import { useRef, useState, useSyncExternalStore } from 'react'
import scrollIntoView from 'scroll-into-view-transition'
import { onlyIfNeeded } from 'scroll-into-view-transition/middleware'
import * as Example from './Example'
import Select from './Select'
import { snippetKey, viewTransition, viewTransitionEasings } from './snippets'

import styles from './ExampleIfNeeded.module.css'

const range = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const targets = ['C', 'D', 'F']

type Easing = keyof typeof viewTransitionEasings
type ScrollMode = 'if-needed' | 'always'

const reducedMotion = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(onChange: () => void) {
  const query = matchMedia(reducedMotion)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function fallbackReason(): string | null {
  if (!('startViewTransition' in document)) {
    return 'View Transitions are not supported in this browser'
  }
  if (matchMedia(reducedMotion).matches) {
    return 'you prefer reduced motion'
  }
  return null
}

/** `children` are the snippets rendered by `Code.astro` */
export default function ExampleViewTransition(props: {
  children?: React.ReactNode
}) {
  const items = useRef<Record<string, HTMLElement | null>>({})
  const [easing, setEasing] = useState<Easing>(viewTransition.initial.easing)
  const [scrollMode, setScrollMode] = useState<ScrollMode>(
    viewTransition.initial.scrollMode
  )
  const fallback = useSyncExternalStore(
    subscribeToReducedMotion,
    fallbackReason,
    // The server render can't know what the browser supports
    () => null
  )

  const doScroll = (target: HTMLElement | null | undefined) => {
    if (!target) return
    void scrollIntoView(target, {
      duration: 600,
      easing: viewTransitionEasings[easing],
      middleware: scrollMode === 'if-needed' ? [onlyIfNeeded()] : [],
    })
  }

  return (
    <Example.Section>
      <Example.Code>
        <Example.CodeHeader>
          <Select
            label="Easing"
            onChange={(event) => setEasing(event.target.value)}
            value={easing}
          >
            <option value="default">Default</option>
            <option value="ease-in-out">Ease in out</option>
            <option value="overshoot">Overshoot</option>
          </Select>

          <Select
            label="Scroll mode"
            onChange={(event) => setScrollMode(event.target.value)}
            value={scrollMode}
          >
            <option value="if-needed">If needed</option>
            <option value="always">Always</option>
          </Select>
        </Example.CodeHeader>
        <Example.CodeBody snippet={snippetKey({ easing, scrollMode })}>
          {props.children}
        </Example.CodeBody>
      </Example.Code>
      <Example.Result>
        <Example.ResultHeader>
          <span>Scroll to&nbsp;</span>
          {targets.map((name) => (
            <Example.Button
              key={name}
              onClick={() => doScroll(items.current[name])}
            >
              {name}
            </Example.Button>
          ))}
        </Example.ResultHeader>
        {fallback && <p className="help">Scrolling instantly: {fallback}.</p>}
        <Example.ScrollContainer>
          {range.map((name) => (
            <div
              key={name}
              className={cx(styles.item, 'has-background-info is-size-4')}
              ref={(node) => {
                items.current[name] = node
              }}
            >
              {name}
            </div>
          ))}
        </Example.ScrollContainer>
      </Example.Result>
    </Example.Section>
  )
}
