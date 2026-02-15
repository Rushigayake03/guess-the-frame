// src/components/AdminHeader.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, getUser } from '@/lib/auth'
import { useEffect } from 'react'
import Image from 'next/image'

export default function AdminHeader() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const userData = await getUser()
    setUser(userData)
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut()
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 mb-8 flex items-center justify-between border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
          <Image
            src="/images/admin.svg"
            alt="Admin Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-gray-900 font-bold">Admin User</p>
          <p className="text-gray-800 text-sm font-medium">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        🚪 Logout
      </button>
    </div>
  )
}

