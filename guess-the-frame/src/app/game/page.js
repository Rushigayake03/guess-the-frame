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
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center">
        <div className="px-4 text-center">
          <div className="relative">
            <Loader2 className="mx-auto mb-5 h-16 w-16 text-yellow-500 animate-spin sm:mb-6 sm:h-24 sm:w-24" />
          </div>
          <p className="text-xl font-bold uppercase tracking-wide text-[#8D5A2B] sm:text-2xl sm:tracking-wider">Loading Cinema...</p>
          <p className="text-gray-700 text-sm mt-2">Preparing your frames</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md rounded-2xl border-2 border-red-500 bg-red-500/10 p-6 text-center backdrop-blur-md sm:p-8">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-red-400 sm:h-16 sm:w-16" />
          <h2 className="mb-4 text-2xl font-black uppercase text-red-400 sm:text-3xl">Film Reel Error</h2>
          <p className="text-red-300 mb-6 font-medium">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/upload')}
              className="block w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
            >
              Upload Frames
            </button>
            <button
              onClick={() => router.push('/play')}
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
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
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center">
        <div className="px-4 text-center">
          <Film className="mx-auto mb-4 h-14 w-14 text-[#8D5A2B] sm:h-16 sm:w-16" />
          <p className="text-xl font-bold text-[#8D5A2B] sm:text-2xl">No frames available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBD4] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-yellow-600/5 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-600/5 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-5 lg:min-h-screen lg:py-6 relative z-10 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 animate-slide-in-down shrink-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Film className="h-7 w-7 text-[#8D5A2B] sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            <div>
              <h1 className="text-xl font-black uppercase tracking-wide text-[#8D5A2B] drop-shadow-lg sm:text-2xl lg:text-3xl lg:tracking-wider">
                Guess the Frame
              </h1>
              <p className="text-xs font-medium text-gray-700 lg:text-sm">Can you identify the movie?</p>
            </div>
          </div>
          <div className="w-full rounded-xl border-2 border-[#9b7648]/45 bg-[#b8ac8f]/95 px-4 py-2 backdrop-blur-md sm:w-auto">
            <p className="text-[#8D5A2B] text-xs font-bold uppercase tracking-wide">Frame</p>
            <p className="text-2xl font-black text-gray-900 sm:text-right">{currentFrameIndex + 1}<span className="text-base text-gray-700">/{totalFrames}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-3">
          {/* Left Column - Game Area */}
          <div className="flex min-h-0 flex-col gap-3 lg:col-span-2">
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
              <div className="animate-slide-in-up shrink-0 rounded-2xl border border-[#b59e78]/60 bg-[#efe4c9]/80 p-4 backdrop-blur-sm">
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
              <div className="animate-slide-in-up shrink-0" style={{animationDelay: '0.1s'}}>
                <AnswerInput
                  onSubmit={onSubmitAnswer}
                  disabled={!timerActive}
                  isCorrect={answerResult}
                />
              </div>
            )}

            {/* Game Controls */}
              <div className="animate-slide-in-up shrink-0" style={{animationDelay: '0.2s'}}>
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
          <div className="lg:col-span-1 lg:min-h-0">
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
      <div className="min-h-screen bg-[#FDFBD4] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Film className="w-8 h-8 text-[#8D5A2B]" />
          <div className="text-2xl font-bold text-[#8D5A2B] sm:text-3xl">Loading...</div>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}

