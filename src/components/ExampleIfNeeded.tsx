import cx from 'classnames'
import { PureComponent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'
import Code from './Code'
import * as Example from './Example'
import Select from './Select'

import styles from './ExampleIfNeeded.module.css'

const range = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

class IfNeeded extends PureComponent {
  state = {
    selectedBehavior: 'smooth-ponyfill',
    scrollMode: 'if-needed' as const,
  }

  items: { [key: string]: HTMLElement } = {}

  doScroll = (target) =>
    (this.state.selectedBehavior === 'smooth'
      ? scrollIntoView
      : smoothScrollIntoView)(target, {
      behavior:
        this.state.selectedBehavior === 'smooth-ponyfill'
          ? 'smooth'
          : (this.state.selectedBehavior as any),
      scrollMode: this.state.scrollMode,
    })

  render() {
    const { selectedBehavior, scrollMode } = this.state
    const behavior =
      (selectedBehavior as 'smooth-ponyfill') === 'smooth-ponyfill'
        ? 'smooth'
        : selectedBehavior

    const SourceCode = `
        import scrollIntoView from '${
          (selectedBehavior as 'smooth-ponyfill') === 'smooth-ponyfill'
            ? 'smooth-'
            : ''
        }scroll-into-view-if-needed';


        scrollIntoView(node, ${JSON.stringify({ behavior, scrollMode })})
        `
    return (
      <Example.Section>
        <Example.Code>
          <Example.CodeHeader>
            <Select
              label="Behavior"
              onChange={(event) =>
                this.setState({ selectedBehavior: event.target.value })
              }
              value={selectedBehavior}
            >
              <option value="smooth-ponyfill">Ponyfill smooth</option>
              <option value="smooth">Native smooth</option>
              <option value="auto">Auto</option>
            </Select>

            <Select
              label="Scroll mode"
              onChange={(event) =>
                this.setState({ scrollMode: event.target.value })
              }
              value={scrollMode}
            >
              <option value="if-needed">If needed</option>
              <option value="always">Always</option>
            </Select>
          </Example.CodeHeader>
          <Example.CodeBody>
            <Code value={SourceCode} />
          </Example.CodeBody>
        </Example.Code>
        <Example.Result>
          <Example.ResultHeader>
            <span>Scroll to&nbsp;</span>
            <Example.Button onClick={() => this.doScroll(this.items.C)}>
              C
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items.D)}>
              D
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items.F)}>
              F
            </Example.Button>
          </Example.ResultHeader>
          <Example.ScrollContainer>
            {range.map((name) => (
              <div
                key={name}
                className={cx(styles.item, 'has-background-primary is-size-4')}
                ref={(node) => (this.items[name] = node as HTMLElement)}
              >
                {name}
              </div>
            ))}
          </Example.ScrollContainer>
        </Example.Result>
      </Example.Section>
    )
  }
}

export default IfNeeded
