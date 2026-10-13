export function ErrorMessage({ error }) {
  if (!error) return null
  return (
    <p className="message message-error" role="alert">
      {error.message}
    </p>
  )
}

export function SuccessMessage({ children }) {
  if (!children) return null
  return (
    <p className="message message-success" role="status">
      {children}
    </p>
  )
}

// Renders loading, error or empty states, otherwise its children.
export function DataState({ loading, error, isEmpty, emptyText = 'No hay resultados.', children }) {
  if (loading) return <p role="status">Cargando…</p>
  if (error) return <ErrorMessage error={error} />
  if (isEmpty) return <p>{emptyText}</p>
  return children
}
