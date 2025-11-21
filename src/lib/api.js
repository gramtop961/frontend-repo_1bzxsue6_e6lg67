const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const getToken = () => localStorage.getItem('pgb_token')
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('pgb_user') || 'null') } catch { return null }
}
export const setSession = (token, user) => {
  localStorage.setItem('pgb_token', token)
  localStorage.setItem('pgb_user', JSON.stringify(user))
}
export const clearSession = () => {
  localStorage.removeItem('pgb_token')
  localStorage.removeItem('pgb_user')
}

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) {
    let msg = `${res.status}`
    try { const data = await res.json(); msg = data.detail || data.message || msg } catch {}
    throw new Error(msg)
  }
  try { return await res.json() } catch { return null }
}
