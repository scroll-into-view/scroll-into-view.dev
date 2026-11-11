import type { CustomScrollBehaviorCallback } from 'scroll-into-view-if-needed'
import CustomTransition from './ExampleCustomTransition'

const behavior: CustomScrollBehaviorCallback = (actions) =>
  actions.forEach(({ el, top, left }) => {
    const content = el.firstElementChild as HTMLElement
    // If a previous transition is still running, start from where it is now
    const { e: x, f: y } = new DOMMatrix(getComputedStyle(content).transform)
    content.getAnimations().forEach((animation) => animation.cancel())

    const dx = left - el.scrollLeft + x
    const dy = top - el.scrollTop + y
    // Jump to the new scroll position, then animate the
    // content from where it was to where it is now (FLIP)
    el.scroll({ top, left, behavior: 'instant' })
    content.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    )
  })

const source = `(actions) =>
  actions.forEach(({ el, top, left }) => {
    const content = el.firstElementChild
    const dx = left - el.scrollLeft
    const dy = top - el.scrollTop
    // Jump to the new scroll position, then animate the
    // content from where it was to where it is now (FLIP)
    el.scroll({ top, left, behavior: 'instant' })
    content.animate(
      [{ transform: \`translate(\${dx}px, \${dy}px)\` }, { transform: 'none' }],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    )
  })`

export default function ExampleElAnimate() {
  return (
    <CustomTransition
      imports="// No animation library needed, Element.animate() is built into the browser"
      source={source}
      behavior={behavior}
    />
  )
}
