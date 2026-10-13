import { useState } from 'react'
import { listBooks } from '../api/services'
import { MAX_LOAN_ITEMS, MAX_PAGE_SIZE } from '../config'
import { useFetch } from '../hooks/useFetch'
import { DataState } from './Feedback'
import { Field } from './Field'

// Search box with results; selected books are kept by the parent (max MAX_LOAN_ITEMS, no repeats).
export function BookPicker({ selected, onAdd, onRemove }) {
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const { data, loading, error } = useFetch(() => listBooks({ q: query, page: 1, size: MAX_PAGE_SIZE }), [query])
  const isFull = selected.length >= MAX_LOAN_ITEMS
  const isSelected = (book) => selected.some((s) => s.id === book.id)

  return (
    <fieldset>
      <legend>Libros (de 1 a {MAX_LOAN_ITEMS})</legend>
      <Field
        label="Buscar libro"
        type="search"
        value={draftQuery}
        onChange={(e) => setDraftQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setQuery(draftQuery)
          }
        }}
      />
      <button type="button" onClick={() => setQuery(draftQuery)}>
        Buscar
      </button>
      <DataState loading={loading} error={error} isEmpty={data?.items.length === 0} emptyText="No se encontraron libros.">
        <ul className="list">
          {(data?.items ?? []).map((book) => (
            <li key={book.id}>
              <span>
                {book.title} — {book.author} ({book.available_copies} disponibles)
              </span>
              <button type="button" onClick={() => onAdd(book)} disabled={isFull || isSelected(book)}>
                Agregar
              </button>
            </li>
          ))}
        </ul>
      </DataState>
      <h3>Seleccionados</h3>
      {selected.length === 0 ? (
        <p>Ningún libro seleccionado.</p>
      ) : (
        <ul className="list">
          {selected.map((book) => (
            <li key={book.id}>
              <span>{book.title}</span>
              <button type="button" className="secondary" onClick={() => onRemove(book.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
