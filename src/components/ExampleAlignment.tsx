import cx from 'classnames'
import { PureComponent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import type { Options } from 'compute-scroll-into-view'
import Code from './Code'
import * as Example from './Example'
import Select from './Select'

import styles from './ExampleAlignment.module.css'

const range = [1, 2, 3, 4, 5, 6, 7, 8, 9]

class Alignment extends PureComponent<{}, Pick<Options, 'block' | 'inline'>> {
  state = {
    block: 'center' as const,
    inline: 'center' as const,
  }

  items: (HTMLElement | null)[] = []

  doScroll = (target) =>
    scrollIntoView(target, {
      behavior: 'smooth',
      block: this.state.block,
      inline: this.state.inline,
    })

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value })

  render() {
    const { block, inline } = this.state

    const SourceCode = `
    import scrollIntoView from 'scroll-into-view-if-needed';

    scrollIntoView(node, ${JSON.stringify({
      behavior: 'smooth',
      block,
      inline,
    })})
    `
    return (
      <Example.Section>
        <Example.Code>
          <Example.CodeHeader>
            <Select label="Block" onChange={this.handleChange} value={block}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="nearest">Nearest</option>
            </Select>

            <Select label="Inline" onChange={this.handleChange} value={inline}>
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
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
            <Example.Button onClick={() => this.doScroll(this.items[1])}>
              1
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items[5])}>
              5
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items[9])}>
              9
            </Example.Button>
          </Example.ResultHeader>
          <Example.ScrollContainer>
            <div
              className={cx(
                styles.scrollLayer,
                'columns is-multiline is-mobile is-gapless'
              )}
            >
              {range.map((number) => (
                <div
                  key={number}
                  className={cx(styles.item, 'column is-one-third')}
                >
                  <div
                    className={cx(
                      styles.tile,
                      'has-background-primary is-size-1'
                    )}
                    ref={(node) => (this.items[number] = node)}
                  >
                    {number}
                  </div>
                </div>
              ))}
            </div>
          </Example.ScrollContainer>
        </Example.Result>
      </Example.Section>
    )
  }
}

export default Alignment
