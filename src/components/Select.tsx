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
  return (
    <div className="control">
      {label}
      :&nbsp;
      <div className="select is-small is-black">
        <select
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
