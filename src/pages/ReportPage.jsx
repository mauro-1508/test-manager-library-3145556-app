import { useState } from 'react'
import { getMostBorrowed } from '../api/services'
import { useAction } from '../hooks/useAction'
import { ErrorMessage } from '../components/Feedback'
import { Field } from '../components/Field'

export function ReportPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [report, setReport] = useState(null)
  const { run, pending, error } = useAction(getMostBorrowed)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setReport(null)
    const result = await run(from, to)
    if (result) setReport(result)
  }

  return (
    <section>
      <h1>Libros más prestados</h1>
      <form onSubmit={handleSubmit} className="filters">
        <Field label="Desde" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
        <Field label="Hasta" type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
        <button type="submit" disabled={pending}>
          {pending ? 'Consultando…' : 'Consultar'}
        </button>
      </form>
      <ErrorMessage error={error} />
      {report &&
        (report.rows.length === 0 ? (
          <p>No hay préstamos en el rango seleccionado.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Categoría</th>
                  <th>Veces prestado</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr key={`${row.book_id}-${row.category_name}`}>
                    <td>{row.book_title}</td>
                    <td>{row.category_name}</td>
                    <td>{row.times_borrowed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </section>
  )
}
