import { useEffect, useState } from 'react'
import { api, getUser } from '../lib/api'
import { useParams, Link } from 'react-router-dom'

export default function PGDetail(){
  const { id } = useParams()
  const user = getUser()
  const [pg, setPg] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [rev, setRev] = useState({ rating: 5, comment: '' })
  const [inq, setInq] = useState({ name: user?.name || '', email: user?.email || '', message: '', phone: user?.phone || '' })

  const load = async () => {
    try {
      const p = await api(`/pgs/${id}`)
      setPg(p)
      const r = await api(`/pgs/${id}/reviews`)
      setReviews(r.items || [])
    } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [id])

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      await api(`/pgs/${id}/reviews`, { method: 'POST', body: rev, auth: true })
      setRev({ rating: 5, comment: '' })
      await load()
    } catch (e) { setError(e.message) }
  }

  const submitInquiry = async (e) => {
    e.preventDefault()
    try {
      await api(`/pgs/${id}/inquiries`, { method: 'POST', body: inq })
      alert('Inquiry sent! The owner will contact you soon.')
      setInq({ name: user?.name || '', email: user?.email || '', message: '', phone: user?.phone || '' })
    } catch (e) { setError(e.message) }
  }

  const waLink = () => {
    const phone = (pg?.owner_phone || '').replace(/[^0-9]/g,'')
    const text = encodeURIComponent(`Hi, I'm interested in ${pg?.name}`)
    return `https://wa.me/${phone}?text=${text}`
  }

  if (!pg) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <Link to="/" className="text-blue-600">← Back</Link>
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 bg-white rounded-xl shadow p-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
              {pg.images?.[0] ? <img src={pg.images[0]} alt="" className="w-full h-full object-cover" /> : null}
            </div>
            <h1 className="text-2xl font-bold">{pg.name}</h1>
            <p className="text-slate-600">{pg.address} • {pg.college} • ₹{pg.rent}</p>
            <p className="text-slate-700 mt-2">Facilities:</p>
            <div className="flex gap-2 flex-wrap mt-1">
              {pg.facilities?.map(f => <span key={f} className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">{f}</span>)}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Location</h3>
              {pg.location?.lat && pg.location?.lng ? (
                <iframe className="w-full h-64 rounded" title="map" src={`https://maps.google.com/maps?q=${pg.location.lat},${pg.location.lng}&z=15&output=embed`}></iframe>
              ) : (
                <iframe className="w-full h-64 rounded" title="map" src={`https://maps.google.com/maps?q=${encodeURIComponent(pg.address||pg.college)}&z=15&output=embed`}></iframe>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Reviews • ⭐ {pg.avg_rating} ({pg.reviews_count})</h3>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border rounded p-3">
                    <p className="font-semibold">{r.user_name} • ⭐{r.rating}</p>
                    <p className="text-sm text-slate-700">{r.comment}</p>
                  </div>
                ))}
                {reviews.length===0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
              </div>

              {user ? (
                <form onSubmit={submitReview} className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Your rating:</label>
                    <select value={rev.rating} onChange={e=>setRev({...rev, rating:Number(e.target.value)})} className="border rounded p-1">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <textarea className="w-full border rounded p-2" placeholder="Write a review" value={rev.comment} onChange={e=>setRev({...rev, comment:e.target.value})}></textarea>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit review</button>
                </form>
              ) : (
                <p className="text-sm mt-2">Please <Link className="text-blue-600" to="/login">login</Link> to post a review.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 h-fit">
            <h3 className="font-semibold mb-2">Contact Owner</h3>
            {pg.owner_phone ? (
              <a className="block w-full text-center bg-green-600 text-white py-2 rounded" href={waLink()} target="_blank">Message via WhatsApp</a>
            ) : <p className="text-sm text-slate-600">Owner hasn't added a phone number.</p>}
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Send Inquiry</h4>
              <form onSubmit={submitInquiry} className="space-y-2">
                <input className="w-full border rounded p-2" placeholder="Your name" value={inq.name} onChange={e=>setInq({...inq, name:e.target.value})} required />
                <input className="w-full border rounded p-2" placeholder="Email" type="email" value={inq.email} onChange={e=>setInq({...inq, email:e.target.value})} required />
                <input className="w-full border rounded p-2" placeholder="Phone" value={inq.phone} onChange={e=>setInq({...inq, phone:e.target.value})} />
                <textarea className="w-full border rounded p-2" placeholder="Message" value={inq.message} onChange={e=>setInq({...inq, message:e.target.value})}></textarea>
                <button className="w-full bg-blue-600 text-white py-2 rounded">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
