import { request } from './client'

export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: { username, password }, skipAuthRedirect: true })

export const createLibrarian = ({ username, password }) =>
  request('/users', { method: 'POST', body: { username, password, role: 'librarian' } })

export const listCategories = () => request('/categories')

export const listBooks = (params) => request('/books', { params })
export const createBook = (book) => request('/books', { method: 'POST', body: book })
export const updateBook = (id, book) => request(`/books/${id}`, { method: 'PUT', body: book })
export const deleteBook = (id) => request(`/books/${id}`, { method: 'DELETE' })
export const removeCover = (id) => request(`/books/${id}/cover`, { method: 'DELETE' })
export const uploadCover = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request(`/books/${id}/cover`, { method: 'PUT', formData })
}

export const listMembers = (params) => request('/members', { params })
export const getMember = (id) => request(`/members/${id}`)
export const createMember = (member) => request('/members', { method: 'POST', body: member })

export const createLoan = (memberId, bookIds) =>
  request('/loans', { method: 'POST', body: { member_id: memberId, items: bookIds.map((book_id) => ({ book_id })) } })
export const listLoans = (params) => request('/loans', { params })
export const getLoan = (id) => request(`/loans/${id}`)
export const returnLoanItem = (loanId, itemId) =>
  request(`/loans/${loanId}/items/${itemId}/return`, { method: 'POST' })
export const listOverdue = (params) => request('/loans/overdue', { params })

export const getMostBorrowed = (from, to) => request('/reports/most-borrowed', { params: { from, to } })
