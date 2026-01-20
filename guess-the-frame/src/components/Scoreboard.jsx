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
    <div className="w-full bg-gray-800 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Game Stats</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getModeColor()}`}>
          {getModeEmoji()} {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Score */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Score</p>
          <p className="text-4xl font-bold text-white">{score}</p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Progress</p>
          <p className="text-4xl font-bold text-white">{frameNumber}/{totalFrames}</p>
        </div>

        {/* Correct Answers */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Correct</p>
          <p className="text-4xl font-bold text-white">{correctAnswers}</p>
        </div>

        {/* Accuracy */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Accuracy</p>
          <p className="text-4xl font-bold text-white">{accuracy}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round((frameNumber / totalFrames) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(frameNumber / totalFrames) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}