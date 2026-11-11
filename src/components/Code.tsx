import { codeToHtml } from '@pierre/highlights'
import dracula from '@pierre/highlights/themes/dracula'
import { memo, useMemo } from 'react'

import styles from './Code.module.css'

const decoder = new TextDecoder()

function Code(props: { value: string }) {
  const html = useMemo(
    () =>
      // codeToHtml returns bytes that may be overwritten by the next call,
      // so decode them right away
      decoder.decode(
        codeToHtml(props.value, {
          lang: 'javascript',
          theme: dracula,
        })
      ),
    [props.value]
  )
  return (
    <div className={styles.code} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default memo(Code)
