import cx from 'classnames'
import { PureComponent } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import * as Example from './Example'
import Select from './Select'
import { boundary as boundarySnippet, snippetKey } from './snippets'

import styles from './ExampleBoundary.module.css'

const range = ['😁', '🤯', '😅', '🤔', '🤩', '🤨', '😲']

interface BoundaryState {
  block: 'start' | 'center' | 'end' | 'nearest'
  boundary: boolean
}
/** `children` are the snippets rendered by `Code.astro` */
class Boundary extends PureComponent<
  { children?: React.ReactNode },
  BoundaryState
> {
  state: BoundaryState = { ...boundarySnippet.initial }

  frameBoundary: Element
  items: { [key: string]: HTMLElement } = {}

  doScroll = (target) =>
    scrollIntoView(target, {
      behavior: 'smooth',
      block: this.state.block,
      boundary: this.state.boundary ? this.frameBoundary : undefined,
    })

  render() {
    const { boundary, block } = this.state

    return (
      <Example.Section>
        <Example.Code>
          <Example.CodeHeader>
            <div className="control">
              <label>
                Boundary:&nbsp;
                <input
                  name="boundary"
                  type="checkbox"
                  checked={boundary}
                  onChange={(event) =>
                    this.setState({ boundary: event.target.checked })
                  }
                />
              </label>
            </div>
            <Select
              label="Block"
              onChange={(event) =>
                this.setState({
                  block: event.target.value as
                    | 'start'
                    | 'center'
                    | 'end'
                    | 'nearest',
                })
              }
              value={block}
            >
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
              <option value="nearest">Nearest</option>
            </Select>
          </Example.CodeHeader>
          <Example.CodeBody snippet={snippetKey({ block, boundary })}>
            {this.props.children}
          </Example.CodeBody>
        </Example.Code>
        <Example.Result>
          <Example.ResultHeader>
            <span>Scroll to&nbsp;</span>
            <Example.Button onClick={() => this.doScroll(this.items[range[1]])}>
              {range[1]}
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items[range[3]])}>
              {range[3]}
            </Example.Button>
            <Example.Button onClick={() => this.doScroll(this.items[range[5]])}>
              {range[5]}
            </Example.Button>
          </Example.ResultHeader>
          <Example.ScrollContainer
            id="example-boundary"
            ref={(node) => (this.frameBoundary = node as Element)}
          >
            {range.map((name) => (
              <div
                key={name}
                className={cx(styles.item, 'has-background-dark is-size-4')}
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

export default Boundary
