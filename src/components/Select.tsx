import { useId } from 'react'

export default function Select({
  label,
  children,
  onChange,
  value,
}: {
  label: string
  children: React.ReactNode
  onChange: any
  value: string
}) {
  const id = useId()

  return (
    <div className="control">
      <label htmlFor={id}>{label}:&nbsp;</label>
      <div className="select is-small is-black">
        <select
          id={id}
          onChange={onChange}
          value={value}
          name={label.toLowerCase().replace(' ', '-')}
        >
          {children}
        </select>
      </div>
    </div>
  )
}
