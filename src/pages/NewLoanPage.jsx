import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createLoan } from '../api/services'
import { useAction } from '../hooks/useAction'
import { BookPicker } from '../components/BookPicker'
import { ErrorMessage, SuccessMessage } from '../components/Feedback'
import { MemberPicker } from '../components/MemberPicker'

export function NewLoanPage() {
  const [memberId, setMemberId] = useState('')
  const [books, setBooks] = useState([])
  const [createdLoan, setCreatedLoan] = useState(null)
  const { run, pending, error } = useAction(createLoan)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setCreatedLoan(null)
    const loan = await run(
      memberId,
      books.map((b) => b.id),
    )
    if (loan) {
      setCreatedLoan(loan)
      setBooks([])
    }
  }

  return (
    <section>
      <h1>Nuevo préstamo</h1>
      <form onSubmit={handleSubmit}>
        <MemberPicker value={memberId} onChange={setMemberId} />
        <BookPicker
          selected={books}
          onAdd={(book) => setBooks([...books, book])}
          onRemove={(id) => setBooks(books.filter((b) => b.id !== id))}
        />
        <ErrorMessage error={error} />
        <button type="submit" disabled={pending || !memberId || books.length === 0}>
          Registrar préstamo
        </button>
      </form>
      {createdLoan && (
        <SuccessMessage>
          Préstamo registrado. <Link to={`/loans/${createdLoan.id}`}>Ver préstamo</Link>
        </SuccessMessage>
      )}
    </section>
  )
}
