import { useState } from 'react'
import { listOverdue } from '../api/services'
import { DEFAULT_PAGE_SIZE } from '../config'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime } from '../utils/format'
import { DataState } from '../components/Feedback'
import { Pagination } from '../components/Pagination'

export function OverduePage() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => listOverdue({ page, size: DEFAULT_PAGE_SIZE }), [page])

  return (
    <section>
      <h1>Libros vencidos</h1>
      <DataState loading={loading} error={error} isEmpty={data?.items.length === 0} emptyText="No hay libros vencidos.">
        {data && (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Libro</th>
                    <th>Socio</th>
                    <th>Vencía</th>
                    <th>Días de retraso</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((row) => (
                    <tr key={row.item_id}>
                      <td>{row.book_title}</td>
                      <td>{row.member_name}</td>
                      <td>{formatDateTime(row.due_at)}</td>
                      <td>{row.days_late}</td>
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
