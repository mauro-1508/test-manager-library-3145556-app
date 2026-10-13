export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
export const ROLES = { ADMIN: 'admin', LIBRARIAN: 'librarian' }
export const MAX_PAGE_SIZE = 50
export const DEFAULT_PAGE_SIZE = 20
export const MAX_LOAN_ITEMS = 3
export const LOAN_STATUS_LABELS = { open: 'Abierto', overdue: 'Vencido', closed: 'Cerrado' }
