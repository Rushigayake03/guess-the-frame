// app/game/page.js
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Timer from '@/components/Timer'
import BlurredFrame from '@/components/BlurredFrame'
import AnswerInput from '@/components/AnswerInput'
import GameControls from '@/components/GameControls'
import Scoreboard from '@/components/Scoreboard'
import ScorePopup from '@/components/ScorePopup'
//import { checkAnswer } from '@/lib/answer-matching'
//import { calculateScore } from '@/lib/utils'
import { useGameSession } from '@/hooks/useGameSession'
//import { supabase } from '../lib/supabase'
import { supabase } from '@/lib/supabase'

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gameMode = searchParams.get('mode') || 'mixed'

  const [showScorePopup, setShowScorePopup] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  // USE THE HOOK - only pass gameMode
  const {
    currentFrame,
    currentFrameIndex,
    score,
    correctAnswers,
    isRevealed,
    timerActive,
    elapsedTime,
    answerResult,
    showingAnswer,
    loading,
    error,
    gameComplete,
    totalFrames,
    handleReveal,
    handleSubmitAnswer,
    handleTimeUp,
    handleNextFrame,
    handleShowAnswer,
    setElapsedTime,
  } = useGameSession(gameMode)

  // Handle answer submission with popup
  const onSubmitAnswer = async (userAnswer) => {
    const result = await handleSubmitAnswer(userAnswer)
    if (result && result.isCorrect && result.points > 0) {
      setEarnedPoints(result.points)
      setShowScorePopup(true)
    }
  }

  // Redirect when game is complete
  useEffect(() => {
    if (gameComplete) {
      router.push(`/results?score=${score}&correct=${correctAnswers}&total=${totalFrames}&mode=${gameMode}`)
    }
  }, [gameComplete, score, correctAnswers, totalFrames, gameMode, router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading game...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md bg-red-500/20 border border-red-500 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Game</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/upload')}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Upload Frames
            </button>
            <button
              onClick={() => router.push('/play')}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Back to Game Modes
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No frames available
  if (!currentFrame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No frames available</p>
          <button
            onClick={() => router.push('/admin/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Upload Frames
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            🎬 Guess the Frame
          </h1>
          <div className="text-white/60 text-lg">
            Frame {currentFrameIndex + 1} / {totalFrames}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Frame */}
            <BlurredFrame
              imageUrl={currentFrame.image_url}
              isRevealed={isRevealed}
              movieTitle={currentFrame.movies?.title || 'Unknown'}
            />

            {/* Timer (only show after reveal) */}
            {isRevealed && !showingAnswer && (
              <Timer
                duration={20}
                isActive={timerActive}
                onTimeUp={handleTimeUp}
                onTick={(elapsed) => setElapsedTime(elapsed)}
              />
            )}

            {/* Answer Input (only show after reveal) */}
            {isRevealed && !showingAnswer && (
              <AnswerInput
                onSubmit={onSubmitAnswer}
                disabled={!timerActive}
                isCorrect={answerResult}
              />
            )}

            {/* Game Controls */}
            <GameControls
              onReveal={handleReveal}
              onNext={handleNextFrame}
              onShowAnswer={handleShowAnswer}
              isRevealed={isRevealed}
              correctAnswer={currentFrame.movies?.title || 'Unknown'}
              showingAnswer={showingAnswer}
            />
          </div>

          {/* Right Column - Scoreboard */}
          <div className="lg:col-span-1">
            <Scoreboard
              score={score}
              frameNumber={currentFrameIndex + 1}
              totalFrames={totalFrames}
              correctAnswers={correctAnswers}
              gameMode={gameMode}
            />
          </div>
        </div>
      </div>

      {/* Score Popup */}
      <ScorePopup
        points={earnedPoints}
        show={showScorePopup}
        onComplete={() => setShowScorePopup(false)}
      />
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}