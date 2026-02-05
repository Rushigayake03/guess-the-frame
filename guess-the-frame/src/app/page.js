// src/app/page.js
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
            🎬 Guess the Frame
          </h1>
          <p className="text-2xl text-gray-300">
            Can you guess the movie from a single frame?
          </p>
        </div>

        {/* Game Modes */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Link 
            href="/play"
            className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span>🎮 Start Playing</span>
              <span className="text-sm opacity-80">20 Frames Challenge</span>
            </div>
          </Link>

          <Link 
            href="/admin/upload"
            className="block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span>🔧 Admin Panel</span>
              <span className="text-sm opacity-80">Manage Frames</span>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-bold mb-2">Time-Based Scoring</h3>
            <p className="text-gray-400 text-sm">Answer faster, score more points!</p>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🌍</div>
            <h3 className="font-bold mb-2">Hollywood & Bollywood</h3>
            <p className="text-gray-400 text-sm">Choose your favorite movies</p>
          </div>
          <div className="text-center text-white">
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-bold mb-2">Share Results</h3>
            <p className="text-gray-400 text-sm">Challenge friends on social media</p>
          </div>
        </div>
      </div>
    </main>
  )
}