import { useState } from 'react'
import { createBook, listBooks, updateBook } from '../api/services'
import { useAuth } from '../auth/AuthContext'
import { DEFAULT_PAGE_SIZE } from '../config'
import { useCategories } from '../hooks/useCategories'
import { useFetch } from '../hooks/useFetch'
import { BookAdminActions } from '../components/BookAdminActions'
import { BookForm } from '../components/BookForm'
import { DataState, ErrorMessage } from '../components/Feedback'
import { Field, SelectField } from '../components/Field'
import { Pagination } from '../components/Pagination'

export function CataloguePage() {
  const { isAdmin } = useAuth()
  const { categories, error: categoriesError } = useCategories()
  const [filters, setFilters] = useState({ q: '', category_id: '' })
  const [draftQuery, setDraftQuery] = useState('')
  const [page, setPage] = useState(1)
  const [formBook, setFormBook] = useState(null) // null: closed, {}: create, book: edit
  const { data, loading, error, reload } = useFetch(
    () => listBooks({ ...filters, page, size: DEFAULT_PAGE_SIZE }),
    [filters, page],
  )

  const applySearch = (event) => {
    event.preventDefault()
    setFilters({ ...filters, q: draftQuery })
    setPage(1)
  }

  const changeCategory = (event) => {
    setFilters({ ...filters, category_id: event.target.value })
    setPage(1)
  }

  const saveBook = async (values) => {
    if (formBook.id) await updateBook(formBook.id, values)
    else await createBook(values)
    setFormBook(null)
    reload()
  }

  return (
    <section>
      <h1>Catálogo</h1>
      <form onSubmit={applySearch} className="filters">
        <Field label="Buscar por título o autor" type="search" value={draftQuery} onChange={(e) => setDraftQuery(e.target.value)} />
        <SelectField label="Categoría" value={filters.category_id} onChange={changeCategory}>
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <button type="submit">Buscar</button>
      </form>
      <ErrorMessage error={categoriesError} />

      {isAdmin && !formBook && (
        <button type="button" onClick={() => setFormBook({})}>
          Nuevo libro
        </button>
      )}
      {isAdmin && formBook && (
        <BookForm
          key={formBook.id ?? 'new'}
          initial={formBook.id ? formBook : null}
          categories={categories}
          onSubmit={saveBook}
          onCancel={() => setFormBook(null)}
        />
      )}

      <DataState loading={loading} error={error} isEmpty={data?.items.length === 0} emptyText="No se encontraron libros.">
        {data && (
          <>
            <p>Total: {data.total}</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>ISBN</th>
                    <th>Categoría</th>
                    <th>Disponibles</th>
                    <th>Portada</th>
                    {isAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.category?.name}</td>
                      <td>
                        {book.available_copies} / {book.total_copies}
                      </td>
                      <td>{book.cover_key ? 'Con portada' : 'Sin portada'}</td>
                      {isAdmin && (
                        <td>
                          <BookAdminActions book={book} onEdit={setFormBook} onChanged={reload} />
                        </td>
                      )}
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
