// app/play/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PlayPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState(null)

  const startGame = (mode) => {
    // Navigate to game page with selected mode
    router.push(`/game?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 transition"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Choose Your Game Mode
          </h1>
          <p className="text-xl text-gray-300">
            Select a category and start guessing!
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Hollywood */}
          <button
            onClick={() => startGame('hollywood')}
            className="group relative bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold text-white mb-3">Hollywood</h2>
            <p className="text-blue-100 mb-4">
              English movies from around the world
            </p>
            <div className="text-sm text-blue-200 opacity-75">
              20 frames • Time-based scoring
            </div>
            <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
          </button>

          {/* Bollywood */}
          <button
            onClick={() => startGame('bollywood')}
            className="group relative bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-3xl font-bold text-white mb-3">Bollywood</h2>
            <p className="text-orange-100 mb-4">
              Hindi cinema classics and hits
            </p>
            <div className="text-sm text-orange-200 opacity-75">
              20 frames • Time-based scoring
            </div>
            <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
          </button>

          {/* Mixed */}
          <button
            onClick={() => startGame('mixed')}
            className="group relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-3xl font-bold text-white mb-3">Mixed</h2>
            <p className="text-purple-100 mb-4">
              The ultimate challenge - all movies!
            </p>
            <div className="text-sm text-purple-200 opacity-75">
              20 frames • Time-based scoring
            </div>
            <div className="absolute inset-0 border-4 border-white/20 rounded-2xl group-hover:border-white/40 transition"></div>
          </button>
        </div>

        {/* Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-white font-bold mb-2">Fast Answers = More Points</h3>
            <p className="text-gray-400 text-sm">
              Answer within 5 seconds for +5 bonus points!
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-white font-bold mb-2">20 Frames Challenge</h3>
            <p className="text-gray-400 text-sm">
              Guess as many movies as you can from single frames
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-white font-bold mb-2">Beat Your Best</h3>
            <p className="text-gray-400 text-sm">
              Track your score and compete for the top spot!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}