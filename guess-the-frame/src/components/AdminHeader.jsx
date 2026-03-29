// src/components/AdminHeader.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, getUser } from '@/lib/auth'
import Image from 'next/image'

export default function AdminHeader() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser()
      setUser(userData)
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut()
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white font-bold">
          <Image
            src="/images/admin.svg"
            alt="Admin Profile"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900">Admin User</p>
          <p className="truncate text-sm font-medium text-gray-800">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700 sm:w-auto"
      >
        🚪 Logout
      </button>
    </div>
  )
}
