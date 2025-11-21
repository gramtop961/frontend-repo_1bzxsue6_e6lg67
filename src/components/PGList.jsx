import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function PGList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ q: '', college: '', city: '', min_price: '', max_price: '', amenities: [] })

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k,v]) => {
        if (k === 'amenities') { if (v.length) params.set('amenities', v.join(',')) }
        else if (v !== '' && v != null) params.set(k, v)
      })
      const res = await api(`/pgs?${params.toString()}`)
      setItems(res.items || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const toggleAmenity = (a) => {
    setFilters(f => {
      const has = f.amenities.includes(a)
      const amenities = has ? f.amenities.filter(x=>x!==a) : [...f.amenities, a]
      return { ...f, amenities }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Find PGs near your college</h1>

        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <div className="grid md:grid-cols-6 gap-3">
            <input className="border border-white/20 bg-transparent rounded p-2 text-white placeholder:text-white/60" placeholder="Search" value={filters.q} onChange={e=>setFilters({...filters, q:e.target.value})} />
            <input className="border border-white/20 bg-transparent rounded p-2 text-white placeholder:text-white/60" placeholder="College" value={filters.college} onChange={e=>setFilters({...filters, college:e.target.value})} />
            <input className="border border-white/20 bg-transparent rounded p-2 text-white placeholder:text-white/60" placeholder="City" value={filters.city} onChange={e=>setFilters({...filters, city:e.target.value})} />
            <input className="border border-white/20 bg-transparent rounded p-2 text-white placeholder:text-white/60" placeholder="Min Price" type="number" value={filters.min_price} onChange={e=>setFilters({...filters, min_price:e.target.value})} />
            <input className="border border-white/20 bg-transparent rounded p-2 text-white placeholder:text-white/60" placeholder="Max Price" type="number" value={filters.max_price} onChange={e=>setFilters({...filters, max_price:e.target.value})} />
            <button onClick={load} className="bg-blue-600 rounded text-white">Search</button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap text-sm">
            {['wifi','ac','laundry','meals','parking','security'].map(a => (
              <button key={a} onClick={()=>toggleAmenity(a)} className={`px-3 py-1 rounded border ${filters.amenities.includes(a) ? 'bg-blue-600 border-blue-600' : 'border-white/30'}`}>{a}</button>
            ))}
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid md:grid-cols-3 gap-4">
          {items.map(pg => (
            <Link to={`/pg/${pg.id}`} key={pg.id} className="bg-white/10 rounded-xl p-3 hover:bg-white/15 transition">
              <div className="aspect-video rounded-lg overflow-hidden bg-black/20 mb-2">
                {pg.images?.[0] ? <img src={pg.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/50">No image</div>}
              </div>
              <p className="font-semibold">{pg.name}</p>
              <p className="text-white/70 text-sm">{pg.college} • ₹{pg.rent} • ⭐ {pg.avg_rating || 0} ({pg.reviews_count || 0})</p>
              <div className="mt-2 flex gap-1 flex-wrap text-xs text-white/70">
                {pg.facilities?.slice(0,4).map(f => <span key={f} className="px-2 py-0.5 rounded bg-white/10">{f}</span>)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
