// components/Timer.jsx
'use client'

import { useState, useEffect } from 'react'

export default function Timer({ duration = 20, onTimeUp, isActive, onTick }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        onTick?.(duration - newTime) // Pass elapsed time to parent
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isActive, onTimeUp, onTick, duration])

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  const percentage = (timeLeft / duration) * 100
  const isWarning = timeLeft <= 5
  const isCritical = timeLeft <= 3

  return (
    <div className="w-full">
      {/* Time Display */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">Time Remaining</span>
        <span 
          className={`text-5xl font-bold tabular-nums transition-colors ${
            isCritical ? 'text-red-500 animate-pulse' : 
            isWarning ? 'text-orange-500' : 
            'text-white'
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' :
            isWarning ? 'bg-orange-500' : 
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Warning Text */}
      {isWarning && (
        <p className="text-center text-sm mt-2 text-orange-400 font-medium">
          ⚠️ Hurry up!
        </p>
      )}
    </div>
  )
}