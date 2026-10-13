import { useRef } from 'react'
import { deleteBook, removeCover, uploadCover } from '../api/services'
import { useAction } from '../hooks/useAction'
import { ErrorMessage } from './Feedback'

const COVER_ACCEPT = 'image/jpeg,image/png'

export function BookAdminActions({ book, onEdit, onChanged }) {
  const fileInput = useRef(null)
  const remove = useAction(deleteBook)
  const upload = useAction(uploadCover)
  const unsetCover = useAction(removeCover)
  const error = remove.error || upload.error || unsetCover.error

  const afterAction = async (action, ...args) => {
    const result = await action.run(...args)
    if (result !== undefined) onChanged()
  }

  const handleDelete = () => {
    if (window.confirm(`¿Dar de baja «${book.title}»?`)) afterAction(remove, book.id)
  }

  const handleFile = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (file) afterAction(upload, book.id, file)
  }

  return (
    <div className="actions">
      <button type="button" onClick={() => onEdit(book)}>
        Editar
      </button>
      <button type="button" className="danger" onClick={handleDelete}>
        Eliminar
      </button>
      <input
        ref={fileInput}
        type="file"
        accept={COVER_ACCEPT}
        onChange={handleFile}
        hidden
        aria-label={`Portada de ${book.title}`}
      />
      <button type="button" onClick={() => fileInput.current.click()} disabled={upload.pending}>
        Subir portada
      </button>
      {book.cover_key && (
        <button type="button" onClick={() => afterAction(unsetCover, book.id)} disabled={unsetCover.pending}>
          Quitar portada
        </button>
      )}
      <ErrorMessage error={error} />
    </div>
  )
}
