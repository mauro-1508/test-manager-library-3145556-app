import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useAction } from '../hooks/useAction'
import { ErrorMessage } from '../components/Feedback'
import { Field } from '../components/Field'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { run, pending, error } = useAction(login)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    // On success the session changes and the redirect above applies.
    await run(username, password)
  }

  return (
    <main className="login">
      <h1>Manager Library</h1>
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <Field label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        <Field
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <ErrorMessage error={error} />
        <button type="submit" disabled={pending}>
          {pending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
