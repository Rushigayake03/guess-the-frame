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
    switch(gameMode) {
      case 'hollywood': return 'from-blue-600 to-blue-700'
      case 'bollywood': return 'from-orange-600 to-orange-700'
      case 'mixed': return 'from-purple-600 to-purple-700'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  const getModeIcon = () => {
    switch(gameMode) {
      case 'hollywood': return Film
      case 'bollywood': return Film
      case 'mixed': return Film
      default: return Film
    }
  }

  const ModeIcon = getModeIcon()

  return (
    <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-4 lg:p-5 shadow-2xl border-2 border-yellow-600/30 animate-slide-in-right">
      {/* Header with Film Reel Icon */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-yellow-600/30">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-black text-yellow-400 uppercase tracking-wider">Stats</h2>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getModeColor()} shadow-lg transform hover:scale-[1.02] transition-transform flex items-center gap-2`}>
          <ModeIcon className="w-3.5 h-3.5" />
          {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Score */}
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-3 rounded-xl text-center shadow-lg border-2 border-yellow-500/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-100" />
            <p className="text-xs text-yellow-100 font-bold uppercase tracking-wide">Score</p>
          </div>
          <p className="text-4xl font-black text-white drop-shadow-lg">{score}</p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl text-center shadow-lg border-2 border-blue-500/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="w-4 h-4 text-blue-100" />
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wide">Progress</p>
          </div>
          <p className="text-4xl font-black text-white drop-shadow-lg">{frameNumber}<span className="text-xl text-blue-200">/{totalFrames}</span></p>
        </div>

        {/* Correct Answers */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-xl text-center shadow-lg border-2 border-green-500/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-100" />
            <p className="text-xs text-green-100 font-bold uppercase tracking-wide">Correct</p>
          </div>
          <p className="text-4xl font-black text-white drop-shadow-lg">{correctAnswers}</p>
        </div>

        {/* Accuracy */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl text-center shadow-lg border-2 border-purple-500/50 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-100" />
            <p className="text-xs text-purple-100 font-bold uppercase tracking-wide">Accuracy</p>
          </div>
          <p className="text-4xl font-black text-white drop-shadow-lg">{accuracy}<span className="text-xl text-purple-200">%</span></p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/40 p-3 rounded-xl border-2 border-yellow-600/20">
        <div className="flex justify-between text-xs text-yellow-400 mb-2 font-bold">
          <span className="uppercase tracking-wide">Game Progress</span>
          <span className="text-yellow-300">{Math.round((frameNumber / totalFrames) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden border border-yellow-600/30">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${(frameNumber / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      {/* Motivational Text */}
      <div className="mt-4 text-center">
        {accuracy >= 80 ? (
          <p className="text-yellow-400/70 text-sm font-medium italic flex items-center justify-center gap-2">
            <Flame className="w-4 h-4" />
            You're on fire!
          </p>
        ) : accuracy >= 60 ? (
          <p className="text-yellow-400/70 text-sm font-medium italic flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Great performance!
          </p>
        ) : (
          <p className="text-yellow-400/70 text-sm font-medium italic flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Keep guessing!
          </p>
        )}
      </div>
    </div>
  )
}

