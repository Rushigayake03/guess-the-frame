// app/test-components/page.js
'use client'

import { useState } from 'react'
import Timer from '@/components/Timer'
import BlurredFrame from '@/components/BlurredFrame'
import AnswerInput from '@/components/AnswerInput'
import GameControls from '@/components/GameControls'
import Scoreboard from '@/components/Scoreboard'
import ScorePopup from '@/components/ScorePopup'


export default function TestComponents() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Sample movie frame (you can use any image URL)
  const sampleImage = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🎮 Component Test Page
        </h1>

        {/* Scoreboard */}
        <Scoreboard 
          score={45}
          frameNumber={5}
          totalFrames={20}
          correctAnswers={3}
          gameMode="hollywood"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* BlurredFrame */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Blurred Frame</h2>
              <BlurredFrame 
                imageUrl={sampleImage}
                isRevealed={isRevealed}
                movieTitle="The Dark Knight"
              />
            </div>

            {/* GameControls */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Game Controls</h2>
              <GameControls 
                isRevealed={isRevealed}
                onReveal={() => {
                  setIsRevealed(true)
                  setTimerActive(true)
                }}
                onNext={() => alert('Next frame!')}
                onShowAnswer={() => alert('Answer: The Dark Knight')}
                correctAnswer="The Dark Knight"
                showingAnswer={false}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Timer */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Timer</h2>
              <Timer 
                duration={20}
                isActive={timerActive}
                onTimeUp={() => {
                  alert('Time\'s up!')
                  setTimerActive(false)
                }}
                onTick={(elapsed) => console.log('Elapsed:', elapsed)}
              />
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                {timerActive ? 'Pause' : 'Start'} Timer
              </button>
            </div>

            {/* AnswerInput */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Answer Input</h2>
              <AnswerInput 
                onSubmit={(answer) => {
                  alert(`You answered: ${answer}`)
                  setShowPopup(true)
                }}
                disabled={!isRevealed}
              />
            </div>

            {/* Score Popup Test */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Score Popup</h2>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Show Score Popup
              </button>
            </div>
          </div>
        </div>

        {/* ScorePopup */}
        <ScorePopup 
          points={15}
          show={showPopup}
          onComplete={() => setShowPopup(false)}
        />
      </div>
    </div>
  )
}