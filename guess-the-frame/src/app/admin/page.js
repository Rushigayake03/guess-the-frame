// src/app/admin/page.js
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import AdminHeader from '@/components/AdminHeader'

const adminCards = [
  {
    href: '/admin/upload',
    emoji: '📤',
    title: 'Upload Frames',
    description: 'Add new movie frames from TMDb',
    className: 'from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700',
    textClassName: 'text-blue-100',
  },
  {
    href: '/admin/frames',
    emoji: '🎬',
    title: 'Manage Frames',
    description: 'Edit and delete movie frames',
    className: 'from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700',
    textClassName: 'text-purple-100',
  },
  {
    href: '/admin/packs',
    emoji: '📦',
    title: 'Manage Packs',
    description: 'Create themed collections',
    className: 'from-green-600 to-green-800 hover:from-green-500 hover:to-green-700',
    textClassName: 'text-green-100',
  },
]

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#FDFBD4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <AdminHeader />

          <div className="mb-10 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              🔧 Admin Panel
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Manage your movie frames and collections
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-5 sm:mb-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {adminCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`group relative rounded-2xl bg-gradient-to-br p-6 shadow-2xl transition-all transform hover:scale-[1.02] sm:p-7 lg:p-8 ${card.className}`}
              >
                <div className="mb-4 text-5xl sm:text-6xl">{card.emoji}</div>
                <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">{card.title}</h2>
                <p className={card.textClassName}>{card.description}</p>
                <div className="absolute inset-0 rounded-2xl border-4 border-white/20 transition group-hover:border-white/40"></div>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-5 backdrop-blur sm:p-6 lg:p-8">
            <h3 className="mb-5 text-xl font-bold text-white sm:mb-6 sm:text-2xl">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              <Link
                href="/admin/upload"
                className="rounded-lg bg-blue-600 px-6 py-4 text-center font-bold text-white transition hover:bg-blue-700"
              >
                + Upload New Frame
              </Link>
              <Link
                href="/admin/packs"
                className="rounded-lg bg-green-600 px-6 py-4 text-center font-bold text-white transition hover:bg-green-700"
              >
                + Create New Pack
              </Link>
              <Link
                href="/admin/frames"
                className="rounded-lg bg-purple-600 px-6 py-4 text-center font-bold text-white transition hover:bg-purple-700"
              >
                📝 View All Frames
              </Link>
              <Link
                href="/"
                className="rounded-lg bg-gray-700 px-6 py-4 text-center font-bold text-white transition hover:bg-gray-600"
              >
                🏠 Back to Home
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800/30 p-5 backdrop-blur sm:mt-8 sm:p-6">
            <h4 className="mb-3 text-lg font-bold text-white">💡 Admin Tips</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Upload frames with clear, recognizable scenes from movies</li>
              <li>• Create themed packs to organize similar movies together</li>
              <li>• Use the TMDb ID to auto-fetch movie information</li>
              <li>• Edit movie details if TMDb data is incorrect</li>
              <li>• Delete frames that are too easy or too hard</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
