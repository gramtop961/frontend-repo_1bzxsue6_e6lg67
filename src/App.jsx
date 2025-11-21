import { Link, useNavigate } from 'react-router-dom'
import PGList from './components/PGList'
import { getUser, clearSession } from './lib/api'

function Navbar(){
  const nav = useNavigate()
  const user = getUser()
  const logout = () => { clearSession(); nav(0) }
  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/" className="text-white text-xl font-bold">PG Buddy</Link>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-white/80 hover:text-white">Explore</Link>
        {user?.role==='owner' && <Link to="/dashboard" className="text-white/80 hover:text-white">Dashboard</Link>}
        {!user && <>
          <Link to="/login" className="px-3 py-1 rounded bg-white/10 text-white">Login</Link>
          <Link to="/signup" className="px-3 py-1 rounded bg-blue-600 text-white">Sign up</Link>
        </>}
        {user && <button onClick={logout} className="px-3 py-1 rounded bg-white/10 text-white">Logout</button>}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="relative max-w-6xl mx-auto p-6">
        <Navbar />
        <PGList />
      </div>
    </div>
  )
}

export default App