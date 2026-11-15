import { animate } from 'motion'
import type { CustomScrollBehaviorCallback } from 'scroll-into-view-if-needed'
import CustomTransition from './ExampleCustomTransition'
import { motionTransition } from './snippets'

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

/** `children` is the snippet rendered by `Code.astro` */
export default function ExampleMotion(props: { children?: React.ReactNode }) {
  return (
    <CustomTransition
      behavior={behavior}
      initialInline={motionTransition.initial.inline}
    >
      {props.children}
    </CustomTransition>
  )
}
