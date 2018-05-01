import { PureComponent } from 'react'
import styled from 'styled-components'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'
import scrollIntoView from 'scroll-into-view-if-needed'

import Code from '../Code'
import * as Example from '../Example'
import Select from '../Select'

const Item = styled.div.attrs({
  className: 'has-background-primary is-size-4',
})`
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  display: flex;
  height: ${Example.SIZE / 4 - 10}px;
  margin: 20px;
  color: hsla(0, 0%, 0%, 0.4);
`

const range = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

class IfNeeded extends PureComponent {
  state = {
    selectedBehavior: 'smooth',
    scrollMode: 'if-needed' as 'if-needed',
  }

  items: { [key: string]: HTMLElement } = {}

  componentDidMount() {
    // Thanks to Safari
    'scrollBehavior' in document.documentElement.style ||
      this.setState({ selectedBehavior: 'smooth-ponyfill' })
  }

  doScroll = target =>
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

    return (
      <Example.Section>
        <Example.Code>
          <Example.CodeHeader>
            <Select
              label="Behavior"
              onChange={event =>
                this.setState({ selectedBehavior: event.target.value })
              }
              value={selectedBehavior}
            >
              <option value="smooth-ponyfill">Ponyfill smooth</option>
              <option value="smooth">Native smooth</option>
              <option value="instant">Instant</option>
            </Select>

            <Select
              label="Scroll mode"
              onChange={event =>
                this.setState({ scrollMode: event.target.value })
              }
              value={scrollMode}
            >
              <option value="if-needed">If needed</option>
              <option value="always">Always</option>
            </Select>
          </Example.CodeHeader>
          <Example.CodeBody>
            <Code>
              {`
        import scrollIntoView from '${
          (selectedBehavior as 'smooth-ponyfill') === 'smooth-ponyfill'
            ? 'smooth-'
            : ''
        }scroll-into-view-if-needed';


        scrollIntoView(node, ${JSON.stringify({ behavior, scrollMode })})
        `}
            </Code>
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
            {range.map(name => (
              <Item key={name} innerRef={node => (this.items[name] = node)}>
                {name}
              </Item>
            ))}
          </Example.ScrollContainer>
        </Example.Result>
      </Example.Section>
    )
  }
}

export default IfNeeded
