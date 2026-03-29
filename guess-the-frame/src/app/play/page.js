// app/play/page.js
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Film, Drama, Globe, Zap, Target, Trophy, BarChart3, Clock } from 'lucide-react'
import { GAME_MODES } from '@/lib/game-modes'

const modeIcons = {
  film: Film,
  drama: Drama,
  globe: Globe,
}

export default function PlayPage() {
  const router = useRouter()

  const startGame = (mode) => {
    // Play button click sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
    audio.volume = 0.3
    audio.play().catch(e => console.log('Audio play failed:', e))
    
    // Navigate to game page with selected mode
    router.push(`/game?mode=${mode}`)
  }

  return (
    <div className="min-h-screen bg-[#FDFBD4] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-yellow-600/10 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96"></div>
          <div className="absolute bottom-1/3 right-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16 relative z-10">
        {/* Back Button */}
        <Link 
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700 transition-all duration-200 hover:scale-[1.02] hover:text-yellow-400 transform sm:mb-8 sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lobby
        </Link>

        {/* Header with Film Strip */}
        <div className="mb-12 text-center animate-slide-in-down sm:mb-14 lg:mb-16">
          <div className="inline-block max-w-full">
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-yellow-600/30 bg-black/40 px-5 py-5 text-center backdrop-blur-md sm:flex-row sm:px-8 sm:py-4 sm:text-left">
              <Film className="h-12 w-12 text-yellow-400 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-black uppercase tracking-wide text-yellow-400 drop-shadow-lg sm:text-4xl lg:text-6xl lg:tracking-wider">
                  Select Cinema
                </h1>
                <p className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg">Choose your movie category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Cards */}
        <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 lg:mb-16 lg:gap-8">
          {GAME_MODES.map((mode) => {
            const ModeIcon = modeIcons[mode.icon]

            return (
              <button
                key={mode.slug}
                onClick={() => startGame(mode.slug)}
                className={`group relative inline-flex h-auto min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-2xl border-4 p-6 font-medium text-white shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl animate-slide-in-up sm:min-h-[20rem] sm:p-7 lg:p-8 ${mode.cardClassName}`}
                style={{ animationDelay: mode.animationDelay }}
              >
                <ModeIcon className="relative z-10 mb-4 h-14 w-14 text-white sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
                <h2 className="relative z-10 mb-3 text-3xl font-black uppercase tracking-wide text-white sm:text-[2rem] lg:text-4xl">
                  {mode.title}
                </h2>
                <p className={`relative z-10 mb-5 max-w-sm text-base font-medium sm:text-lg ${mode.descriptionClassName}`}>
                  {mode.description}
                </p>
                <div className={`relative z-10 flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg bg-black/30 px-4 py-3 text-sm sm:max-w-none sm:flex-row sm:gap-4 sm:py-2 ${mode.metaClassName}`}>
                  <span className="flex items-center gap-1 font-bold">
                    <BarChart3 className="w-4 h-4" />
                    20 Frames
                  </span>
                  <span className={`hidden sm:inline ${mode.separatorClassName}`}>|</span>
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="w-4 h-4" />
                    Time Bonus
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Info Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          <div className="animate-fade-in rounded-xl border-2 border-[#c29257]/60 bg-[#fff8dc]/95 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-yellow-500/50 sm:p-6" style={{animationDelay: '0.3s'}}>
            <Zap className="mb-3 h-10 w-10 text-yellow-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase tracking-wide text-yellow-400 sm:text-xl">Speed Bonus</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Answer within 5 seconds for <span className="text-yellow-400 font-bold">+5 bonus</span> points!
            </p>
          </div>

          <div className="animate-fade-in rounded-xl border-2 border-[#b9864e]/55 bg-[#fff8dc]/95 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-blue-500/50 sm:p-6" style={{animationDelay: '0.4s'}}>
            <Target className="mb-3 h-10 w-10 text-blue-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase tracking-wide text-blue-400 sm:text-xl">20 Frame Quest</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Identify as many movies as you can from <span className="text-blue-400 font-bold">single frames</span>
            </p>
          </div>

          <div className="animate-fade-in rounded-xl border-2 border-[#ad7944]/55 bg-[#fff8dc]/95 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-500/50 sm:p-6" style={{animationDelay: '0.5s'}}>
            <Trophy className="mb-3 h-10 w-10 text-purple-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase tracking-wide text-purple-400 sm:text-xl">High Score</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Track your score and <span className="text-purple-400 font-bold">compete</span> for the top spot!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


