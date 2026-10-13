import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { configureClient } from '../api/client'
import { login as loginRequest } from '../api/services'
import { ROLES } from '../config'
import { clearSession, loadSession, saveSession } from './session'

const AuthContext = createContext(null)

// In-memory copy of the session, read by the API client on every request.
let currentSession = loadSession()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(currentSession)

  const updateSession = useCallback((next) => {
    currentSession = next
    if (next) saveSession(next)
    else clearSession()
    setSession(next)
  }, [])

  const logout = useCallback(() => updateSession(null), [updateSession])

  configureClient({ tokenProvider: () => currentSession?.token ?? null, unauthorizedHandler: logout })

  const login = useCallback(
    async (username, password) => {
      const data = await loginRequest(username, password)
      updateSession({ token: data.access_token, role: data.role })
    },
    [updateSession],
  )

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === ROLES.ADMIN,
      login,
      logout,
    }),
    [session, login, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
