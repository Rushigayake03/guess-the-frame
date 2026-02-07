// app/play/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PlayPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState(null)

  const startGame = (mode) => {
    // Play button click sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
    audio.volume = 0.3
    audio.play().catch(e => console.log('Audio play failed:', e))
    
    // Navigate to game page with selected mode
    router.push(`/game?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-yellow-400 mb-8 transition-all duration-200 font-bold uppercase tracking-wide hover:scale-105 transform"
        >
          ← Back to Lobby
        </Link>

        {/* Header with Film Strip */}
        <div className="text-center mb-16 animate-slide-in-down">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border-2 border-yellow-600/30 rounded-2xl px-8 py-4">
              <span className="text-6xl">🎞️</span>
              <div className="text-left">
                <h1 className="text-6xl font-black text-yellow-400 uppercase tracking-wider drop-shadow-lg">
                  Select Cinema
                </h1>
                <p className="text-gray-300 text-lg font-medium">Choose your movie category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Hollywood */}
          <button
            onClick={() => startGame('hollywood')}
            className="group relative bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-500/50 border-4 border-blue-400/30 overflow-hidden animate-slide-in-up"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎬</div>
              <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-wide">Hollywood</h2>
              <p className="text-blue-100 mb-6 font-medium text-lg">
                English movies from around the world
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-blue-200 bg-black/30 rounded-lg py-2 px-4">
                <span className="font-bold">📊 20 Frames</span>
                <span className="text-blue-300">•</span>
                <span className="font-bold">⏱️ Time Bonus</span>
              </div>
            </div>
          </button>

          {/* Bollywood */}
          <button
            onClick={() => startGame('bollywood')}
            className="group relative bg-gradient-to-br from-orange-600 to-orange-800 hover:from-orange-500 hover:to-orange-700 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-orange-500/50 border-4 border-orange-400/30 overflow-hidden animate-slide-in-up"
            style={{animationDelay: '0.1s'}}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎭</div>
              <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-wide">Bollywood</h2>
              <p className="text-orange-100 mb-6 font-medium text-lg">
                Hindi cinema classics and blockbusters
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-orange-200 bg-black/30 rounded-lg py-2 px-4">
                <span className="font-bold">📊 20 Frames</span>
                <span className="text-orange-300">•</span>
                <span className="font-bold">⏱️ Time Bonus</span>
              </div>
            </div>
          </button>

          {/* Mixed */}
          <button
            onClick={() => startGame('mixed')}
            className="group relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/50 border-4 border-purple-400/30 overflow-hidden animate-slide-in-up"
            style={{animationDelay: '0.2s'}}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🌍</div>
              <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-wide">Mixed</h2>
              <p className="text-purple-100 mb-6 font-medium text-lg">
                The ultimate challenge - All movies!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-purple-200 bg-black/30 rounded-lg py-2 px-4">
                <span className="font-bold">📊 20 Frames</span>
                <span className="text-purple-300">•</span>
                <span className="font-bold">⏱️ Time Bonus</span>
              </div>
            </div>
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border-2 border-yellow-600/30 transform hover:scale-105 transition-all duration-200 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="text-yellow-400 font-black mb-2 text-xl uppercase tracking-wide">Speed Bonus</h3>
            <p className="text-gray-300 font-medium">
              Answer within 5 seconds for <span className="text-yellow-400 font-bold">+5 bonus</span> points!
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border-2 border-blue-600/30 transform hover:scale-105 transition-all duration-200 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-blue-400 font-black mb-2 text-xl uppercase tracking-wide">20 Frame Quest</h3>
            <p className="text-gray-300 font-medium">
              Identify as many movies as you can from <span className="text-blue-400 font-bold">single frames</span>
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border-2 border-purple-600/30 transform hover:scale-105 transition-all duration-200 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-purple-400 font-black mb-2 text-xl uppercase tracking-wide">High Score</h3>
            <p className="text-gray-300 font-medium">
              Track your score and <span className="text-purple-400 font-bold">compete</span> for the top spot!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}