import { useState } from 'react'
import { createLibrarian } from '../api/services'
import { useAction } from '../hooks/useAction'
import { ErrorMessage, SuccessMessage } from '../components/Feedback'
import { Field } from '../components/Field'

export function UsersPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [created, setCreated] = useState(null)
  const { run, pending, error } = useAction(createLibrarian)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setCreated(null)
    const user = await run({ username, password })
    if (user) {
      setCreated(`Bibliotecario «${user.username}» creado.`)
      setUsername('')
      setPassword('')
    }
  }

  return (
    <section>
      <h1>Nuevo bibliotecario</h1>
      <form onSubmit={handleSubmit}>
        <Field label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" required />
        <Field
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <ErrorMessage error={error} />
        <SuccessMessage>{created}</SuccessMessage>
        <button type="submit" disabled={pending}>
          Crear bibliotecario
        </button>
      </form>
    </section>
  )
}
