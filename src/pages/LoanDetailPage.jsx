import { Link, useParams } from 'react-router-dom'
import { getLoan, returnLoanItem } from '../api/services'
import { LOAN_STATUS_LABELS } from '../config'
import { useAction } from '../hooks/useAction'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime } from '../utils/format'
import { DataState, ErrorMessage } from '../components/Feedback'

export function LoanDetailPage() {
  const { id } = useParams()
  const { data: loan, loading, error, reload } = useFetch(() => getLoan(id), [id])
  const returnItem = useAction(returnLoanItem)

  const handleReturn = async (itemId) => {
    const returned = await returnItem.run(id, itemId)
    if (returned) reload()
  }

  return (
    <section>
      <h1>Detalle del préstamo</h1>
      <DataState loading={loading} error={error}>
        {loan && (
          <>
            <p>Fecha: {formatDateTime(loan.loaned_at)}</p>
            <p>Estado: {LOAN_STATUS_LABELS[loan.status] ?? loan.status}</p>
            <ErrorMessage error={returnItem.error} />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Libro</th>
                    <th>ISBN</th>
                    <th>Categoría</th>
                    <th>Vence</th>
                    <th>Devuelto</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.book_title}</td>
                      <td>{item.isbn}</td>
                      <td>{item.category_name}</td>
                      <td>{formatDateTime(item.due_at)}</td>
                      <td>{formatDateTime(item.returned_at)}</td>
                      <td>
                        {!item.returned_at && (
                          <button type="button" onClick={() => handleReturn(item.id)} disabled={returnItem.pending}>
                            Devolver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DataState>
      <Link to="/loans">Volver a préstamos</Link>
    </section>
  )
}
