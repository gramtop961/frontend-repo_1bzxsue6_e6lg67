import { useState } from 'react'
import { api, setSession } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      setSession(data.access_token, data.user)
      if (data.user.role === 'owner') nav('/dashboard')
      else nav('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white shadow rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
        <p className="text-sm text-slate-600">No account? <Link className="text-blue-600" to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}

export function Signup() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/auth/signup', { method: 'POST', body: { name, email, password, role, phone } })
      setSession(data.access_token, data.user)
      if (role === 'owner') nav('/dashboard')
      else nav('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white shadow rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded p-2" placeholder="Phone (for WhatsApp)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <div className="flex gap-4 items-center text-sm">
          <label className="flex items-center gap-2"><input type="radio" name="role" value="student" checked={role==='student'} onChange={()=>setRole('student')} /> Student</label>
          <label className="flex items-center gap-2"><input type="radio" name="role" value="owner" checked={role==='owner'} onChange={()=>setRole('owner')} /> PG Owner</label>
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">{loading ? 'Creating...' : 'Sign up'}</button>
        <p className="text-sm text-slate-600">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  )
}
