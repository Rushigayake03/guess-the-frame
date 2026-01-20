// app/results/page.js
'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const score = parseInt(searchParams.get('score') || '0')
  const correct = parseInt(searchParams.get('correct') || '0')
  const total = parseInt(searchParams.get('total') || '20')
  const mode = searchParams.get('mode') || 'mixed'
  
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const maxPossibleScore = total * 15 // Max 15 points per frame
  const scorePercentage = Math.round((score / maxPossibleScore) * 100)

  const getGrade = () => {
    if (accuracy >= 90) return { grade: 'S', color: 'from-yellow-400 to-yellow-600', emoji: '🏆' }
    if (accuracy >= 80) return { grade: 'A+', color: 'from-green-400 to-green-600', emoji: '🎉' }
    if (accuracy >= 70) return { grade: 'A', color: 'from-blue-400 to-blue-600', emoji: '👏' }
    if (accuracy >= 60) return { grade: 'B', color: 'from-purple-400 to-purple-600', emoji: '👍' }
    if (accuracy >= 50) return { grade: 'C', color: 'from-orange-400 to-orange-600', emoji: '😊' }
    return { grade: 'D', color: 'from-red-400 to-red-600', emoji: '💪' }
  }

  const gradeInfo = getGrade()

  const shareResults = () => {
    const text = `I scored ${score} points with ${accuracy}% accuracy in Guess the Frame! 🎬\n\nCan you beat my score?`
    
    if (navigator.share) {
      navigator.share({
        title: 'Guess the Frame - My Results',
        text: text,
        url: window.location.origin
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(text + '\n' + window.location.origin)
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Game Complete! {gradeInfo.emoji}
          </h1>
          <p className="text-xl text-gray-300">
            Here's how you did
          </p>
        </div>

        {/* Grade Card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`bg-gradient-to-br ${gradeInfo.color} p-12 rounded-3xl text-center shadow-2xl`}>
            <div className="text-8xl font-black text-white mb-4">
              {gradeInfo.grade}
            </div>
            <div className="text-2xl text-white/90">
              {accuracy}% Accuracy
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{score}</div>
            <div className="text-gray-400">Total Score</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{correct}/{total}</div>
            <div className="text-gray-400">Correct</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{accuracy}%</div>
            <div className="text-gray-400">Accuracy</div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{scorePercentage}%</div>
            <div className="text-gray-400">Score Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto space-y-4">
          <button
            onClick={() => router.push(`/game?mode=${mode}`)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
          >
            🔄 Play Again
          </button>

          <button
            onClick={shareResults}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
          >
            📱 Share Results
          </button>

          <Link
            href="/play"
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl text-xl text-center transition-all"
          >
            🎮 Choose Different Mode
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl text-xl text-center transition-all"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading results...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}