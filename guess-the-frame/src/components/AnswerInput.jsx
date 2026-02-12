// components/AnswerInput.jsx
'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AnswerInput({ 
  onSubmit, 
  disabled = false, 
  isCorrect = null,
  placeholder = "Type movie name..."
}) {
  const [answer, setAnswer] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  // Play sound effect
  const playSound = (isCorrect) => {
    if (isCorrect) {
      // Correct answer sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Audio play failed:', e))
    } else {
      // Wrong answer sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3')
      audio.volume = 0.3
      audio.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  // Trigger shake animation on wrong answer
  useEffect(() => {
    if (isCorrect === false) {
      playSound(false)
      setIsShaking(true)
      const timer = setTimeout(() => setIsShaking(false), 500)
      return () => clearTimeout(timer)
    } else if (isCorrect === true) {
      playSound(true)
    }
  }, [isCorrect])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (answer.trim()) {
      onSubmit(answer.trim())
      setAnswer('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-6 py-5 text-lg rounded-xl border-2 transition-all duration-300
            backdrop-blur-sm font-medium tracking-wide
            ${disabled 
              ? 'bg-black/30 border-gray-700/50 text-gray-500 cursor-not-allowed' 
              : 'bg-black/40 border-yellow-600/50 text-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 focus:shadow-lg focus:shadow-yellow-500/20'
            }
            ${isCorrect === true ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30' : ''}
            ${isCorrect === false ? 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30' : ''}
            outline-none placeholder:text-gray-500`}
          autoComplete="off"
          autoFocus={!disabled}
        />
        
        {/* Submit Button with Scale Animation */}
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-8 py-2.5 rounded-lg font-bold transition-all duration-200
            ${disabled || !answer.trim()
              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400 active:scale-95 hover:scale-105 shadow-lg hover:shadow-yellow-500/50'
            }`}
        >
          SUBMIT
        </button>
      </div>

      {/* Result Feedback with Scale Animation */}
      {isCorrect === true && (
        <div className="mt-3 animate-scale-in">
          <p className="text-green-400 font-bold flex items-center gap-2 text-lg bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <CheckCircle className="w-6 h-6" />
            CORRECT! Brilliant guess!
          </p>
        </div>
      )}
      {isCorrect === false && (
        <div className="mt-3 animate-scale-in">
          <p className="text-red-400 font-bold flex items-center gap-2 text-lg bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            <XCircle className="w-6 h-6" />
            Not quite. Try again!
          </p>
        </div>
      )}
    </form>
  )
}