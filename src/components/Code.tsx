import cx from 'classnames'
import { memo, useMemo } from 'react'
import js from 'refractor/lang/javascript'
import Refractor from 'react-refractor'

import { format } from './utils'

import styles from './Code.module.css'

Refractor.registerLanguage(js)

function Code(props: { value: string }) {
  const value = useMemo(() => format(props.value), [props.value])
  return (
    <Refractor
      className={cx(styles.code, 'is-flex')}
      language="javascript"
      value={value}
    />
  )
}

export default memo(Code)
