import { useEffect, useState } from 'react'
import { api, getUser } from '../lib/api'
import { Link } from 'react-router-dom'

export default function OwnerDashboard() {
  const user = getUser()
  const [items, setItems] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', college: '', rent: 0, facilities: '', gender: 'unisex', images: '', city: '', address: '' })

  const load = async () => {
    try {
      const res = await api('/owner/pgs', { auth: true })
      setItems(res.items || [])
      const an = await api('/owner/analytics', { auth: true })
      setAnalytics(an.items || [])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    try {
      const body = { ...form, facilities: form.facilities.split(',').map(s=>s.trim()).filter(Boolean), images: form.images.split(',').map(s=>s.trim()).filter(Boolean), rent: Number(form.rent) }
      await api('/pgs', { method: 'POST', body, auth: true })
      setForm({ name: '', college: '', rent: 0, facilities: '', gender: 'unisex', images: '', city: '', address: '' })
      await load()
    } catch (e) { setError(e.message) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this PG?')) return
    try { await api(`/pgs/${id}`, { method: 'DELETE', auth: true }); await load() } catch (e) { setError(e.message) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-slate-600">Manage your PG listings and see performance</p>
          </div>
          <Link to="/" className="text-blue-600">Back to site</Link>
        </div>
        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={create} className="bg-white rounded-xl shadow p-4 space-y-3">
            <h2 className="font-semibold text-lg">Add new PG</h2>
            <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="w-full border p-2 rounded" placeholder="College" value={form.college} onChange={e=>setForm({...form, college:e.target.value})} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full border p-2 rounded" placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Rent" type="number" value={form.rent} onChange={e=>setForm({...form, rent:e.target.value})} />
            </div>
            <input className="w-full border p-2 rounded" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
            <input className="w-full border p-2 rounded" placeholder="Facilities (comma separated)" value={form.facilities} onChange={e=>setForm({...form, facilities:e.target.value})} />
            <input className="w-full border p-2 rounded" placeholder="Image URLs (comma separated)" value={form.images} onChange={e=>setForm({...form, images:e.target.value})} />
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="gender" value="unisex" checked={form.gender==='unisex'} onChange={()=>setForm({...form, gender:'unisex'})} /> Unisex</label>
              <label className="flex items-center gap-2"><input type="radio" name="gender" value="male" checked={form.gender==='male'} onChange={()=>setForm({...form, gender:'male'})} /> Male</label>
              <label className="flex items-center gap-2"><input type="radio" name="gender" value="female" checked={form.gender==='female'} onChange={()=>setForm({...form, gender:'female'})} /> Female</label>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
          </form>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold mb-3">Your PGs</h2>
              <div className="space-y-2">
                {items.map(pg => (
                  <div key={pg.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{pg.name}</p>
                      <p className="text-sm text-slate-600">{pg.college} • ₹{pg.rent} • Views {pg.views||0}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link className="text-blue-600" to={`/pg/${pg.id}`}>View</Link>
                      <button className="text-red-600" onClick={()=>remove(pg.id)}>Delete</button>
                    </div>
                  </div>
                ))}
                {items.length===0 && <p className="text-sm text-slate-500">No PGs yet.</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="font-semibold mb-3">Analytics</h2>
              <div className="space-y-2">
                {analytics.map(a => (
                  <div key={a.pg_id} className="border rounded p-3">
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-sm text-slate-600">Views {a.views} • Inquiries {a.inquiries} • Rating {a.avg_rating} ({a.reviews_count})</p>
                  </div>
                ))}
                {analytics.length===0 && <p className="text-sm text-slate-500">No data yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
