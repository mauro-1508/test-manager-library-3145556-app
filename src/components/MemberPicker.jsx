import { useState } from 'react'
import { listMembers } from '../api/services'
import { MAX_PAGE_SIZE } from '../config'
import { useFetch } from '../hooks/useFetch'
import { ErrorMessage } from './Feedback'
import { Field, SelectField } from './Field'

// Search box plus select. Calls onChange(memberId) with '' when cleared.
export function MemberPicker({ label = 'Socio', value, onChange, emptyOption }) {
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const { data, loading, error } = useFetch(() => listMembers({ q: query, page: 1, size: MAX_PAGE_SIZE }), [query])
  const members = data?.items ?? []

  return (
    <fieldset>
      <legend>{label}</legend>
      <Field
        label="Buscar socio"
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
      <ErrorMessage error={error} />
      <SelectField label={label} value={value} onChange={(e) => onChange(e.target.value)} disabled={loading}>
        <option value="">{loading ? 'Cargando…' : (emptyOption ?? 'Seleccione…')}</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name} ({m.document_number})
          </option>
        ))}
      </SelectField>
    </fieldset>
  )
}
