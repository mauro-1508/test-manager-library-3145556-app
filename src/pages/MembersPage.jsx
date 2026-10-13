import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createMember, listMembers } from '../api/services'
import { DEFAULT_PAGE_SIZE } from '../config'
import { useAction } from '../hooks/useAction'
import { useFetch } from '../hooks/useFetch'
import { DataState, ErrorMessage } from '../components/Feedback'
import { Field } from '../components/Field'
import { Pagination } from '../components/Pagination'

function NewMemberForm({ onCreated }) {
  const [fullName, setFullName] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const { run, pending, error } = useAction(createMember)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const member = await run({ full_name: fullName, document_number: documentNumber })
    if (member) {
      setFullName('')
      setDocumentNumber('')
      onCreated()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Nuevo socio</h2>
      <Field label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <Field label="Documento" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required />
      <ErrorMessage error={error} />
      <button type="submit" disabled={pending}>
        Crear socio
      </button>
    </form>
  )
}

export function MembersPage() {
  const [query, setQuery] = useState('')
  const [draftQuery, setDraftQuery] = useState('')
  const [page, setPage] = useState(1)
  const { data, loading, error, reload } = useFetch(
    () => listMembers({ q: query, page, size: DEFAULT_PAGE_SIZE }),
    [query, page],
  )

  const applySearch = (event) => {
    event.preventDefault()
    setQuery(draftQuery)
    setPage(1)
  }

  return (
    <section>
      <h1>Socios</h1>
      <NewMemberForm onCreated={reload} />
      <form onSubmit={applySearch} className="filters">
        <Field label="Buscar por nombre o documento" type="search" value={draftQuery} onChange={(e) => setDraftQuery(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>
      <DataState loading={loading} error={error} isEmpty={data?.items.length === 0} emptyText="No se encontraron socios.">
        {data && (
          <>
            <p>Total: {data.total}</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((member) => (
                    <tr key={member.id}>
                      <td>{member.full_name}</td>
                      <td>{member.document_number}</td>
                      <td>
                        <Link to={`/members/${member.id}`}>Ver</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={data.page} size={data.size} total={data.total} onChange={setPage} />
          </>
        )}
      </DataState>
    </section>
  )
}
