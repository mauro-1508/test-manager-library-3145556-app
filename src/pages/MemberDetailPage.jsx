import { Link, useParams } from 'react-router-dom'
import { getMember } from '../api/services'
import { useFetch } from '../hooks/useFetch'
import { DataState } from '../components/Feedback'

export function MemberDetailPage() {
  const { id } = useParams()
  const { data: member, loading, error } = useFetch(() => getMember(id), [id])

  return (
    <section>
      <h1>Detalle del socio</h1>
      <DataState loading={loading} error={error}>
        {member && (
          <dl>
            <dt>Nombre</dt>
            <dd>{member.full_name}</dd>
            <dt>Documento</dt>
            <dd>{member.document_number}</dd>
            <dt>Préstamos activos</dt>
            <dd>{member.active_loans}</dd>
          </dl>
        )}
      </DataState>
      <Link to="/members">Volver a socios</Link>
    </section>
  )
}
