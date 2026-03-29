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
    <div className="min-h-screen bg-[#FDFBD4]">
      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:mb-4 sm:text-5xl lg:text-6xl">
            Game Complete! {gradeInfo.emoji}
          </h1>
          <p className="text-base text-gray-700 sm:text-lg lg:text-xl">
            Here&apos;s how you did
          </p>
        </div>

        {/* Grade Card */}
        <div className="mx-auto mb-10 max-w-2xl sm:mb-12">
          <div className={`rounded-3xl bg-gradient-to-br p-6 text-center shadow-2xl sm:p-9 lg:p-12 ${gradeInfo.color}`}>
            <div className="mb-4 text-6xl font-black text-white sm:text-7xl lg:text-8xl">
              {gradeInfo.grade}
            </div>
            <div className="text-lg text-white/90 sm:text-xl lg:text-2xl">
              {accuracy}% Accuracy
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-4 sm:mb-12 sm:gap-5 md:grid-cols-4 md:gap-6">
          <div className="rounded-xl bg-gray-800 p-4 text-center sm:p-5 lg:p-6">
            <div className="mb-2 text-3xl font-bold text-green-400 sm:text-4xl">{score}</div>
            <div className="text-gray-400">Total Score</div>
          </div>

          <div className="rounded-xl bg-gray-800 p-4 text-center sm:p-5 lg:p-6">
            <div className="mb-2 text-3xl font-bold text-blue-400 sm:text-4xl">{correct}/{total}</div>
            <div className="text-gray-400">Correct</div>
          </div>

          <div className="rounded-xl bg-gray-800 p-4 text-center sm:p-5 lg:p-6">
            <div className="mb-2 text-3xl font-bold text-purple-400 sm:text-4xl">{accuracy}%</div>
            <div className="text-gray-400">Accuracy</div>
          </div>

          <div className="rounded-xl bg-gray-800 p-4 text-center sm:p-5 lg:p-6">
            <div className="mb-2 text-3xl font-bold text-orange-400 sm:text-4xl">{scorePercentage}%</div>
            <div className="text-gray-400">Score Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mx-auto max-w-2xl space-y-3 sm:space-y-4">
          <button
            onClick={() => router.push(`/game?mode=${mode}`)}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3.5 text-base font-bold text-white transition-all transform hover:scale-[1.02] hover:from-blue-500 hover:to-blue-600 sm:px-8 sm:py-4 sm:text-lg lg:text-xl"
          >
            🔄 Play Again
          </button>

          <button
            onClick={shareResults}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3.5 text-base font-bold text-white transition-all transform hover:scale-[1.02] hover:from-purple-500 hover:to-purple-600 sm:px-8 sm:py-4 sm:text-lg lg:text-xl"
          >
            📱 Share Results
          </button>

          <Link
            href="/play"
            className="block w-full rounded-xl bg-gray-700 px-5 py-3.5 text-center text-base font-bold text-white transition-all hover:bg-gray-600 sm:px-8 sm:py-4 sm:text-lg lg:text-xl"
          >
            🎮 Choose Different Mode
          </Link>

          <Link
            href="/"
            className="block w-full rounded-xl bg-gray-800 px-5 py-3.5 text-center text-base font-bold text-white transition-all hover:bg-gray-700 sm:px-8 sm:py-4 sm:text-lg lg:text-xl"
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
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center">
        <div className="text-xl text-gray-900 sm:text-2xl">Loading results...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
