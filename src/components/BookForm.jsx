import { useState } from 'react'
import { useAction } from '../hooks/useAction'
import { ErrorMessage } from './Feedback'
import { Field, SelectField } from './Field'

// Create mode shows the ISBN; edit mode (PUT) only sends title, author, category and total.
export function BookForm({ initial, categories, onSubmit, onCancel }) {
  const isEdit = Boolean(initial)
  const [values, setValues] = useState({
    title: initial?.title ?? '',
    author: initial?.author ?? '',
    isbn: initial?.isbn ?? '',
    category_id: initial?.category?.id ?? '',
    total_copies: initial?.total_copies ?? 1,
  })
  const { run, pending, error } = useAction(onSubmit)

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => setValues({ ...values, [name]: e.target.value }),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { isbn, ...rest } = values
    const body = { ...rest, total_copies: Number(values.total_copies) }
    await run(isEdit ? body : { ...body, isbn })
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{isEdit ? 'Editar libro' : 'Nuevo libro'}</h2>
      <Field label="Título" required {...bind('title')} />
      <Field label="Autor" required {...bind('author')} />
      {isEdit ? (
        <p>ISBN: {initial.isbn}</p>
      ) : (
        <Field label="ISBN (13 dígitos)" inputMode="numeric" maxLength={13} required {...bind('isbn')} />
      )}
      <SelectField label="Categoría" required {...bind('category_id')}>
        <option value="">Seleccione…</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </SelectField>
      <Field label="Total de ejemplares" type="number" min="1" required {...bind('total_copies')} />
      <ErrorMessage error={error} />
      <div className="actions">
        <button type="submit" disabled={pending}>
          Guardar
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
