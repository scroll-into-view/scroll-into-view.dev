import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { Chrome, Text as TextIcon } from './Icons'

import styles from './Hero.module.css'

export default function Hero() {
  const [maxHeight, setMaxHeight] = useState('auto')
  const maxHeightRef = useRef<SVGElement>(null)
  const scrollToRef = useRef<SVGElement>(null)
  const scrollToBoundary = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    setMaxHeight(`${maxHeightRef.current.getBoundingClientRect().height}px`)
  }, [])
  useEffect(() => {
    if (maxHeight !== 'auto') {
      const raf = requestAnimationFrame(() => {
        scrollIntoView(scrollToRef.current, {
          block: 'end',
          duration: 600,
          // easeInOutQuint
          ease: (t) =>
            t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
          boundary: scrollToBoundary.current,
        })
      })

      return () => cancelAnimationFrame(raf)
    }
  }, [maxHeight])

  return (
    <header className={styles.header}>
      <div ref={scrollToBoundary} className={styles.wrapper}>
        <Chrome ref={maxHeightRef} />
        <div
          className={styles.scrollWrapper}
          style={{
            maxHeight: maxHeight,
            opacity: maxHeight === 'auto' ? 0 : undefined,
          }}
        >
          <TextIcon ref={scrollToRef} />
        </div>
      </div>
    </header>
  )
}
