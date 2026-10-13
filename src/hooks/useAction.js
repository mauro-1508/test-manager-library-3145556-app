import { useCallback, useState } from 'react'

// Wraps an async action exposing pending and error state.
export function useAction(action) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(
    async (...args) => {
      setPending(true)
      setError(null)
      try {
        return await action(...args)
      } catch (e) {
        setError(e)
        return undefined
      } finally {
        setPending(false)
      }
    },
    [action],
  )
  return { run, pending, error }
}
