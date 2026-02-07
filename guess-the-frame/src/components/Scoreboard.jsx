// components/Scoreboard.jsx
'use client'

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

  const getModeEmoji = () => {
    switch(gameMode) {
      case 'hollywood': return '🎬'
      case 'bollywood': return '🎭'
      case 'mixed': return '🌍'
      default: return '🎮'
    }
  }

  return (
    <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-yellow-600/30 animate-slide-in-right">
      {/* Header with Film Reel Icon */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-yellow-600/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎞️</div>
          <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider">Stats</h2>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getModeColor()} shadow-lg transform hover:scale-105 transition-transform`}>
          {getModeEmoji()} {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Score */}
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-5 rounded-xl text-center shadow-lg border-2 border-yellow-500/50 transform hover:scale-105 transition-all duration-200">
          <p className="text-sm text-yellow-100 mb-2 font-bold uppercase tracking-wide">Score</p>
          <p className="text-5xl font-black text-white drop-shadow-lg">{score}</p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-xl text-center shadow-lg border-2 border-blue-500/50 transform hover:scale-105 transition-all duration-200">
          <p className="text-sm text-blue-100 mb-2 font-bold uppercase tracking-wide">Progress</p>
          <p className="text-5xl font-black text-white drop-shadow-lg">{frameNumber}<span className="text-2xl text-blue-200">/{totalFrames}</span></p>
        </div>

        {/* Correct Answers */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 rounded-xl text-center shadow-lg border-2 border-green-500/50 transform hover:scale-105 transition-all duration-200">
          <p className="text-sm text-green-100 mb-2 font-bold uppercase tracking-wide">Correct</p>
          <p className="text-5xl font-black text-white drop-shadow-lg">{correctAnswers}</p>
        </div>

        {/* Accuracy */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-5 rounded-xl text-center shadow-lg border-2 border-purple-500/50 transform hover:scale-105 transition-all duration-200">
          <p className="text-sm text-purple-100 mb-2 font-bold uppercase tracking-wide">Accuracy</p>
          <p className="text-5xl font-black text-white drop-shadow-lg">{accuracy}<span className="text-2xl text-purple-200">%</span></p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black/40 p-4 rounded-xl border-2 border-yellow-600/20">
        <div className="flex justify-between text-sm text-yellow-400 mb-3 font-bold">
          <span className="uppercase tracking-wide">Game Progress</span>
          <span className="text-yellow-300">{Math.round((frameNumber / totalFrames) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden border border-yellow-600/30">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${(frameNumber / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      {/* Motivational Text */}
      <div className="mt-6 text-center">
        <p className="text-yellow-400/70 text-sm font-medium italic">
          {accuracy >= 80 ? "🌟 You're on fire!" : accuracy >= 60 ? "⚡ Great performance!" : "🎬 Keep guessing!"}
        </p>
      </div>
    </div>
  )
}