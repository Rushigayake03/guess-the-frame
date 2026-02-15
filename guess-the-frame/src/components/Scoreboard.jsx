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
    <div className="w-full bg-[#d8c8a8]/90 backdrop-blur-md rounded-2xl p-4 lg:p-5 shadow-2xl border-2 border-[#9b7648]/45 animate-slide-in-right">
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#9b7648]/45">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[#8D5A2B]" />
          <h2 className="text-xl font-black text-[#8D5A2B] uppercase tracking-wider">Stats</h2>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getModeColor()} shadow-lg flex items-center gap-2`}>
          <ModeIcon className="w-3.5 h-3.5" />
          {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-yellow-700 to-yellow-800 p-3 rounded-xl text-center shadow-lg border-2 border-yellow-600/60">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-100" />
            <p className="text-xs text-yellow-100 font-bold uppercase tracking-wide">Score</p>
          </div>
          <p className="text-4xl font-black text-white">{score}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-3 rounded-xl text-center shadow-lg border-2 border-blue-600/60">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="w-4 h-4 text-blue-100" />
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wide">Progress</p>
          </div>
          <p className="text-4xl font-black text-white">{frameNumber}<span className="text-xl text-blue-100">/{totalFrames}</span></p>
        </div>

        <div className="bg-gradient-to-br from-green-700 to-green-800 p-3 rounded-xl text-center shadow-lg border-2 border-green-600/60">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-100" />
            <p className="text-xs text-green-100 font-bold uppercase tracking-wide">Correct</p>
          </div>
          <p className="text-4xl font-black text-white">{correctAnswers}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-3 rounded-xl text-center shadow-lg border-2 border-purple-600/60">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-100" />
            <p className="text-xs text-purple-100 font-bold uppercase tracking-wide">Accuracy</p>
          </div>
          <p className="text-4xl font-black text-white">{accuracy}<span className="text-xl text-purple-100">%</span></p>
        </div>
      </div>

      <div className="bg-[#7d6a4d] p-3 rounded-xl border-2 border-[#9b7648]/40">
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
          <p className="text-[#6d3b14] text-sm font-bold flex items-center justify-center gap-2">
            <Flame className="w-4 h-4" />
            You're on fire!
          </p>
        ) : accuracy >= 60 ? (
          <p className="text-[#6d3b14] text-sm font-bold flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Great performance!
          </p>
        ) : (
          <p className="text-[#6d3b14] text-sm font-bold flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Keep guessing!
          </p>
        )}
      </div>
    </div>
  )
}
