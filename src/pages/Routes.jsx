import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import Test from '../Test'
import { Login, Signup } from '../components/Auth'
import OwnerDashboard from '../components/OwnerDashboard'
import PGDetail from '../components/PGDetail'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/pg/:id" element={<PGDetail />} />
      <Route path="*" element={<div className='min-h-screen flex items-center justify-center'><div className='text-center'><h1 className='text-3xl font-bold mb-2'>404</h1><p className='text-slate-600'>Page not found</p></div></div>} />
    </Routes>
  )
}
