import { codeToHtml } from '@pierre/highlights'
import pierreDark from '@pierre/highlights/themes/pierre-dark'
import { memo, useMemo } from 'react'

import { format } from './utils'

import styles from './Code.module.css'

const decoder = new TextDecoder()

function Code(props: { value: string }) {
  const html = useMemo(
    () =>
      // codeToHtml returns bytes that may be overwritten by the next call,
      // so decode them right away
      decoder.decode(
        codeToHtml(format(props.value), {
          lang: 'javascript',
          theme: pierreDark,
        })
      ),
    [props.value]
  )
  return (
    <div className={styles.code} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default memo(Code)
