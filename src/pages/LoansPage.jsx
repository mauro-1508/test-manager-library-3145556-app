import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listLoans } from '../api/services'
import { DEFAULT_PAGE_SIZE, LOAN_STATUS_LABELS } from '../config'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime } from '../utils/format'
import { DataState } from '../components/Feedback'
import { Field, SelectField } from '../components/Field'
import { MemberPicker } from '../components/MemberPicker'
import { Pagination } from '../components/Pagination'

const EMPTY_FILTERS = { from: '', to: '', status: '', member_id: '' }

export function LoansPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(
    () => listLoans({ ...filters, page, size: DEFAULT_PAGE_SIZE }),
    [filters, page],
  )

  const setFilter = (name) => (eventOrValue) => {
    const value = eventOrValue?.target ? eventOrValue.target.value : eventOrValue
    setFilters({ ...filters, [name]: value })
    setPage(1)
  }

  return (
    <section>
      <h1>Préstamos</h1>
      <div className="filters">
        <Field label="Desde" type="date" value={filters.from} onChange={setFilter('from')} />
        <Field label="Hasta" type="date" value={filters.to} onChange={setFilter('to')} />
        <SelectField label="Estado" value={filters.status} onChange={setFilter('status')}>
          <option value="">Todos</option>
          {Object.entries(LOAN_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
        <MemberPicker label="Filtrar por socio" value={filters.member_id} onChange={setFilter('member_id')} emptyOption="Todos" />
      </div>
      <DataState loading={loading} error={error} isEmpty={data?.items.length === 0} emptyText="No se encontraron préstamos.">
        {data && (
          <>
            <p>Total: {data.total}</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Libros</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((loan) => (
                    <tr key={loan.id}>
                      <td>{formatDateTime(loan.loaned_at)}</td>
                      <td>{LOAN_STATUS_LABELS[loan.status] ?? loan.status}</td>
                      <td>{loan.items?.map((i) => i.book_title).join(', ')}</td>
                      <td>
                        <Link to={`/loans/${loan.id}`}>Ver</Link>
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
