import cx from 'classnames'
import { forwardRef } from 'react'

import styles from './Example.module.css'

export const Section = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cx(
        styles.section,
        'columns is-gapless is-multiline',
        className
      )}
    >
      {children}
    </div>
  )
}

export const Code = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cx(styles.code, 'column', className)}>{children}</div>
}

export const CodeHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cx(
        styles.codeHeader,
        styles.header,
        'has-background-grey-dark has-text-light',
        className
      )}
    >
      {children}
    </div>
  )
}

export const CodeBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cx(styles.codeBody, 'has-background-grey-darker', className)}
    >
      {children}
    </div>
  )
}

export const Result = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cx(
        styles.result,
        'column is-narrow has-text-centered is-centered has-background-white-bis',
        className
      )}
    >
      {children}
    </div>
  )
}

export const ResultHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cx(
        styles.resultHeader,
        styles.header,
        'example-controls',
        className
      )}
    >
      {children}
    </div>
  )
}

export const ScrollContainer = forwardRef(function ScrollContainer(
  {
    children,
    className,
    id,
  }: { children: React.ReactNode; className?: string; id?: string },
  ref: any
) {
  return (
    <div
      id={id}
      ref={ref}
      className={cx(styles.scrollContainer, 'example-container', className)}
    >
      {children}
    </div>
  )
})

export const Button = forwardRef(function Button(
  {
    children,
    className,
    onClick,
  }: { children: React.ReactNode; className?: string; onClick: any },
  ref?: any
) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(styles.button, 'button is-small', className)}
      ref={ref}
    >
      {children}
    </button>
  )
})
