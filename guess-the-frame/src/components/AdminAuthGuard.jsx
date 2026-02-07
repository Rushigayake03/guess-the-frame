// src/components/AdminAuthGuard.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin, getUser } from '@/lib/auth'

export default function AdminAuthGuard({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const user = await getUser()
    
    if (!user) {
      // Not logged in - redirect to login
      router.push('/admin/login')
      return
    }

    const admin = await isAdmin()
    
    if (!admin) {
      // Logged in but not admin - redirect to home
      alert('Access denied. Admin privileges required.')
      router.push('/')
      return
    }

    // All checks passed
    setAuthorized(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null // Will redirect
  }

  return <>{children}</>
}