import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const COMMON_LINKS = [
  { to: '/', label: 'Catálogo', end: true },
  { to: '/members', label: 'Socios' },
  { to: '/loans', label: 'Préstamos' },
  { to: '/loans/new', label: 'Nuevo préstamo' },
  { to: '/overdue', label: 'Vencidos' },
]
const ADMIN_LINKS = [
  { to: '/users', label: 'Bibliotecarios' },
  { to: '/report', label: 'Reporte' },
]

export function Layout() {
  const { isAdmin, logout } = useAuth()
  const links = isAdmin ? [...COMMON_LINKS, ...ADMIN_LINKS] : COMMON_LINKS
  return (
    <>
      <header className="app-header">
        <strong>Manager Library</strong>
        <nav aria-label="Principal">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end ?? false}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={logout}>
          Cerrar sesión
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
