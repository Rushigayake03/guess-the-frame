// src/components/Timer.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Timer({ duration = 20, onTimeUp, isActive, onTick }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onTickRef = useRef(onTick)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (!isActive) return

    if (timeLeft <= 0) {
      if (onTimeUpRef.current) {
        onTimeUpRef.current()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (onTickRef.current && newTime >= 0) {
          const elapsed = duration - newTime
          setTimeout(() => {
            if (onTickRef.current) {
              onTickRef.current(elapsed)
            }
          }, 0)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isActive, duration])

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  const percentage = (timeLeft / duration) * 100
  const isWarning = timeLeft <= 5
  const isCritical = timeLeft <= 3

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Time Remaining</span>
        <span
          className={`text-4xl font-bold tabular-nums transition-colors ${
            isCritical ? 'text-red-600 animate-pulse' :
            isWarning ? 'text-orange-700' :
            'text-gray-900'
          }`}
        >
          {timeLeft}s
        </span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-red-500' :
            isWarning ? 'bg-orange-500' :
            'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isWarning && (
        <p className="text-center text-sm mt-2 text-orange-700 font-bold inline-flex items-center justify-center gap-2 w-full">
          <AlertTriangle className="w-4 h-4" />
          Hurry up!
        </p>
      )}
    </div>
  )
}
