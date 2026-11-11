import { animate } from 'motion'
import type { CustomScrollBehaviorCallback } from 'scroll-into-view-if-needed'
import CustomTransition from './ExampleCustomTransition'

// Keep track of running animations so a new scroll can interrupt the previous one
const running = new WeakMap<Element, ReturnType<typeof animate>[]>()

const behavior: CustomScrollBehaviorCallback = (actions) =>
  actions.forEach(({ el, top, left }) => {
    running.get(el)?.forEach((animation) => animation.stop())
    running.set(el, [
      animate(el.scrollTop, top, {
        type: 'spring',
        bounce: 0.3,
        onUpdate: (value) => (el.scrollTop = value),
      }),
      animate(el.scrollLeft, left, {
        type: 'spring',
        bounce: 0.3,
        onUpdate: (value) => (el.scrollLeft = value),
      }),
    ])
  })

const source = `(actions) =>
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
  })`

export default function ExampleMotion() {
  return (
    <CustomTransition
      imports="import { animate } from 'motion'"
      source={source}
      behavior={behavior}
    />
  )
}
