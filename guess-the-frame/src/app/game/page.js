// app/game/page.js
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Film, Loader2, AlertCircle } from 'lucide-react'
import Timer from '@/components/Timer'
import BlurredFrame from '@/components/BlurredFrame'
import AnswerInput from '@/components/AnswerInput'
import GameControls from '@/components/GameControls'
import Scoreboard from '@/components/Scoreboard'
import ScorePopup from '@/components/ScorePopup'
import { useGameSession } from '@/hooks/useGameSession'
import { supabase } from '@/lib/supabase'

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gameMode = searchParams.get('mode') || 'mixed'

  const [showScorePopup, setShowScorePopup] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

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
  } = useGameSession(gameMode, null) // null = no specific pack, use game mode

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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-spin" />
          </div>
          <p className="text-yellow-400 text-2xl font-bold uppercase tracking-wider">Loading Cinema...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your frames</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="max-w-md bg-red-500/10 border-2 border-red-500 rounded-2xl p-8 text-center backdrop-blur-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-red-400 mb-4 uppercase">Film Reel Error</h2>
          <p className="text-red-300 mb-6 font-medium">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/upload')}
              className="block w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide"
            >
              Upload Frames
            </button>
            <button
              onClick={() => router.push('/play')}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 uppercase tracking-wide"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No current frame
  if (!currentFrame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-400 text-2xl font-bold">No frames available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in-down">
          <div className="flex items-center gap-4">
            <Film className="w-12 h-12 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-black text-yellow-400 uppercase tracking-wider drop-shadow-lg">
                Guess the Frame
              </h1>
              <p className="text-gray-400 text-sm font-medium">Can you identify the movie?</p>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border-2 border-yellow-600/30 rounded-xl px-6 py-3">
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-wide">Frame</p>
            <p className="text-white text-3xl font-black">{currentFrameIndex + 1}<span className="text-xl text-gray-400">/{totalFrames}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Frame */}
            <div className="animate-slide-in-left">
              <BlurredFrame
                imageUrl={currentFrame.image_url}
                isRevealed={isRevealed}
                movieTitle={currentFrame.movies.title}
              />
            </div>

            {/* Timer (only show after reveal) */}
            {isRevealed && !showingAnswer && (
              <div className="animate-slide-in-up">
                <Timer
                  duration={20}
                  isActive={timerActive}
                  onTimeUp={handleTimeUp}
                  onTick={(elapsed) => setElapsedTime(elapsed)}
                />
              </div>
            )}

            {/* Answer Input (only show after reveal) */}
            {isRevealed && !showingAnswer && (
              <div className="animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                <AnswerInput
                  onSubmit={onSubmitAnswer}
                  disabled={!timerActive}
                  isCorrect={answerResult}
                />
              </div>
            )}

            {/* Game Controls */}
            <div className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <GameControls
                onReveal={handleReveal}
                onNext={handleNextFrame}
                onShowAnswer={handleShowAnswer}
                isRevealed={isRevealed}
                correctAnswer={currentFrame.movies.title}
                showingAnswer={showingAnswer}
              />
            </div>
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Film className="w-8 h-8 text-yellow-400" />
          <div className="text-yellow-400 text-3xl font-bold">Loading...</div>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}