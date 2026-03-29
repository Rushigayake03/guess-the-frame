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
    const checkAuth = async () => {
      const user = await getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      const admin = await isAdmin()

      if (!admin) {
        alert('Access denied. Admin privileges required.')
        router.push('/')
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-t-4 border-b-4 border-blue-500 sm:h-16 sm:w-16"></div>
          <p className="text-lg font-semibold text-gray-900 sm:text-xl">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}
