// components/Scoreboard.jsx
'use client'
import { Film, Trophy, Target, TrendingUp, Flame, Zap, Star } from 'lucide-react'

export default function Scoreboard({
  score = 0,
  frameNumber = 1,
  totalFrames = 20,
  correctAnswers = 0,
  gameMode = 'mixed'
}) {
  const accuracy = frameNumber > 1 ? Math.round((correctAnswers / (frameNumber - 1)) * 100) : 0

  const getModeColor = () => {
    switch (gameMode) {
      case 'hollywood': return 'from-blue-700 to-blue-800'
      case 'bollywood': return 'from-orange-700 to-orange-800'
      case 'mixed': return 'from-purple-700 to-purple-800'
      default: return 'from-gray-700 to-gray-800'
    }
  }

  const ModeIcon = Film

  return (
    <div className="w-full animate-slide-in-right rounded-2xl border-2 border-[#9b7648]/45 bg-[#d8c8a8]/90 p-4 shadow-2xl backdrop-blur-md lg:p-5">
      <div className="mb-4 flex flex-col gap-3 border-b-2 border-[#9b7648]/45 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-[#8D5A2B]" />
          <h2 className="text-lg font-black uppercase tracking-wide text-[#8D5A2B] sm:text-xl sm:tracking-wider">Stats</h2>
        </div>
        <span className={`flex w-fit items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1.5 text-xs font-bold text-white shadow-lg ${getModeColor()}`}>
          <ModeIcon className="w-3.5 h-3.5" />
          {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-yellow-600/60 bg-gradient-to-br from-yellow-700 to-yellow-800 p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-100" />
            <p className="text-xs text-yellow-100 font-bold uppercase tracking-wide">Score</p>
          </div>
          <p className="text-3xl font-black text-white sm:text-4xl">{score}</p>
        </div>

        <div className="rounded-xl border-2 border-blue-600/60 bg-gradient-to-br from-blue-700 to-blue-800 p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="w-4 h-4 text-blue-100" />
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wide">Progress</p>
          </div>
          <p className="text-3xl font-black text-white sm:text-4xl">{frameNumber}<span className="text-lg text-blue-100 sm:text-xl">/{totalFrames}</span></p>
        </div>

        <div className="rounded-xl border-2 border-green-600/60 bg-gradient-to-br from-green-700 to-green-800 p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-100" />
            <p className="text-xs text-green-100 font-bold uppercase tracking-wide">Correct</p>
          </div>
          <p className="text-3xl font-black text-white sm:text-4xl">{correctAnswers}</p>
        </div>

        <div className="rounded-xl border-2 border-purple-600/60 bg-gradient-to-br from-purple-700 to-purple-800 p-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-100" />
            <p className="text-xs text-purple-100 font-bold uppercase tracking-wide">Accuracy</p>
          </div>
          <p className="text-3xl font-black text-white sm:text-4xl">{accuracy}<span className="text-lg text-purple-100 sm:text-xl">%</span></p>
        </div>
      </div>

      <div className="rounded-xl border-2 border-[#9b7648]/40 bg-[#7d6a4d] p-3">
        <div className="flex justify-between text-xs text-[#f3d29f] mb-2 font-bold">
          <span className="uppercase tracking-wide">Game Progress</span>
          <span className="text-[#ffdfad]">{Math.round((frameNumber / totalFrames) * 100)}%</span>
        </div>
        <div className="w-full bg-[#4f3f2c] rounded-full h-2.5 overflow-hidden border border-[#9b7648]/50">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${(frameNumber / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        {accuracy >= 80 ? (
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-[#6d3b14]">
            <Flame className="w-4 h-4" />
            You&apos;re on fire!
          </p>
        ) : accuracy >= 60 ? (
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-[#6d3b14]">
            <Zap className="w-4 h-4" />
            Great performance!
          </p>
        ) : (
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-[#6d3b14]">
            <Star className="w-4 h-4" />
            Keep guessing!
          </p>
        )}
      </div>
    </div>
  )
}
