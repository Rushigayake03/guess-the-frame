// src/app/admin/page.js
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import AdminHeader from '@/components/AdminHeader'

export default function AdminDashboard() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
        <div className="max-w-6xl mx-auto">
          <AdminHeader />
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🔧 Admin Panel
            </h1>
            <p className="text-gray-300 text-lg">
              Manage your movie frames and collections
            </p>
          </div>

          {/* Admin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Upload Frames */}
            <Link
              href="/admin/upload"
              className="relative bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-2xl transition-all transform hover:scale-105 shadow-2xl group"
            >
              <div className="text-6xl mb-4">📤</div>
              <h2 className="text-2xl font-bold text-white mb-3">Upload Frames</h2>
              <p className="text-blue-100">
                Add new movie frames from TMDb
              </p>
              <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
            </Link>

            {/* Manage Frames */}
            <Link
              href="/admin/frames"
              className="relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-2xl transition-all transform hover:scale-105 shadow-2xl group"
            >
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-3">Manage Frames</h2>
              <p className="text-purple-100">
                Edit and delete movie frames
              </p>
              <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
            </Link>

            {/* Manage Packs */}
            <Link
              href="/admin/packs"
              className="relative bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 p-8 rounded-2xl transition-all transform hover:scale-105 shadow-2xl group"
            >
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-white mb-3">Manage Packs</h2>
              <p className="text-green-100">
                Create themed collections
              </p>
              <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-center"
              >
                + Upload New Frame
              </Link>
              <Link
                href="/admin/packs"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition text-center"
              >
                + Create New Pack
              </Link>
              <Link
                href="/admin/frames"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition text-center"
              >
                📝 View All Frames
              </Link>
              <Link
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition text-center"
              >
                🏠 Back to Home
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700">
            <h4 className="text-white font-bold text-lg mb-3">💡 Admin Tips</h4>
            <ul className="text-gray-300 space-y-2 text-sm">
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