import { useId } from 'react'

export function Field({ label, ...inputProps }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...inputProps} />
    </div>
  )
}

export function SelectField({ label, children, ...selectProps }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...selectProps}>
        {children}
      </select>
    </div>
  )
}
