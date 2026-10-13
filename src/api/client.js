import { API_URL } from '../config'

const NETWORK_ERROR_MESSAGE = 'No se pudo conectar con el servidor.'
const UNEXPECTED_ERROR_MESSAGE = 'Ocurrió un error inesperado.'

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || UNEXPECTED_ERROR_MESSAGE)
    this.status = status
    this.code = body?.code
    this.details = body?.details ?? []
  }
}

let getToken = () => null
let onUnauthorized = () => {}

export function configureClient({ tokenProvider, unauthorizedHandler }) {
  getToken = tokenProvider
  onUnauthorized = unauthorizedHandler
}

function buildUrl(path, params) {
  const url = new URL(API_URL.replace(/\/$/, '') + path)
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  })
  return url.toString()
}

export async function request(path, { method = 'GET', params, body, formData, skipAuthRedirect } = {}) {
  const headers = { Accept: 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (formData) {
    payload = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(buildUrl(path, params), { method, headers, body: payload })
  } catch {
    throw new ApiError(0, { message: NETWORK_ERROR_MESSAGE })
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) onUnauthorized()
    throw new ApiError(response.status, data)
  }
  return data
}
