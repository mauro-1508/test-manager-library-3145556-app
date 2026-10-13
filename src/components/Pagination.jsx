export function Pagination({ page, size, total, onChange }) {
  const lastPage = Math.max(1, Math.ceil(total / size))
  return (
    <nav className="pagination" aria-label="Paginación">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Anterior
      </button>
      <span>
        Página {page} de {lastPage} ({total} en total)
      </span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= lastPage}>
        Siguiente
      </button>
    </nav>
  )
}
