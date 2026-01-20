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
import { checkAnswer } from '@/lib/answer-matching'
import { calculateScore } from '@/lib/utils'

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const gameMode = searchParams.get('mode') || 'mixed'

  // Game state
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [answerResult, setAnswerResult] = useState(null)
  const [showingAnswer, setShowingAnswer] = useState(false)
  const [showScorePopup, setShowScorePopup] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  // Mock frames data (we'll replace this with real data from Supabase later)
  const mockFrames = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800",
      movieTitle: "The Dark Knight",
      movieYear: 2008,
      alternativeTitles: ["Dark Knight"]
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
      movieTitle: "Inception",
      movieYear: 2010,
      alternativeTitles: []
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
      movieTitle: "Interstellar",
      movieYear: 2014,
      alternativeTitles: []
    },
    // Add more mock frames as needed
  ]

  const totalFrames = 20
  const currentFrame = mockFrames[currentFrameIndex % mockFrames.length]

  // Handle reveal button
  const handleReveal = () => {
    setIsRevealed(true)
    setTimerActive(true)
    setElapsedTime(0)
  }

  // Handle answer submission
  const handleSubmitAnswer = (userAnswer) => {
    if (!isRevealed || !timerActive) return

    // Stop timer
    setTimerActive(false)

    // Check if answer is correct
    const correctAnswersList = [
      currentFrame.movieTitle,
      `${currentFrame.movieTitle} (${currentFrame.movieYear})`,
      ...currentFrame.alternativeTitles
    ]

    const result = checkAnswer(userAnswer, correctAnswersList)
    
    // Calculate points
    const points = calculateScore(elapsedTime, result.isCorrect)

    // Update state
    setAnswerResult(result.isCorrect)
    
    if (result.isCorrect) {
      setScore(score + points)
      setCorrectAnswers(correctAnswers + 1)
      setEarnedPoints(points)
      setShowScorePopup(true)
    }
  }

  // Handle time up
  const handleTimeUp = () => {
    setTimerActive(false)
    setAnswerResult(false)
  }

  // Handle next frame
  const handleNextFrame = () => {
    if (currentFrameIndex + 1 >= totalFrames) {
      // Game complete
      setGameComplete(true)
      return
    }

    // Reset for next frame
    setCurrentFrameIndex(currentFrameIndex + 1)
    setIsRevealed(false)
    setTimerActive(false)
    setElapsedTime(0)
    setAnswerResult(null)
    setShowingAnswer(false)
  }

  // Handle show answer
  const handleShowAnswer = () => {
    setShowingAnswer(true)
    setTimerActive(false)
  }

  // Redirect if game complete
  useEffect(() => {
    if (gameComplete) {
      router.push(`/results?score=${score}&correct=${correctAnswers}&total=${totalFrames}&mode=${gameMode}`)
    }
  }, [gameComplete, score, correctAnswers, totalFrames, gameMode, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            🎬 Guess the Frame
          </h1>
          <div className="text-white/60">
            Frame {currentFrameIndex + 1} / {totalFrames}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Frame */}
            <BlurredFrame
              imageUrl={currentFrame.imageUrl}
              isRevealed={isRevealed}
              movieTitle={currentFrame.movieTitle}
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
                onSubmit={handleSubmitAnswer}
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
              correctAnswer={currentFrame.movieTitle}
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