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
          className={`w-full px-5 py-3.5 text-base rounded-xl border-2 transition-all duration-300
            backdrop-blur-sm font-medium tracking-wide
            ${disabled 
              ? 'bg-[#e6dcc3] border-[#b9a47f] text-gray-600 cursor-not-allowed' 
              : 'bg-[#efe4c9] border-[#b47f47] text-gray-900 focus:border-[#8D5A2B] focus:ring-4 focus:ring-[#c29158]/30 focus:shadow-lg focus:shadow-[#c29158]/25'
            }
            ${isCorrect === true ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30' : ''}
            ${isCorrect === false ? 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30' : ''}
            outline-none placeholder:text-gray-600`}
          autoComplete="off"
          autoFocus={!disabled}
        />
        
        {/* Submit Button with Scale Animation */}
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200
            ${disabled || !answer.trim()
              ? 'bg-[#b8ac8f] text-[#6f6048] cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-[#d47e30] to-[#8D5A2B] text-[#fffef4] hover:from-[#c06f2a] hover:to-[#825E34] active:scale-[0.98] hover:scale-[1.02] shadow-lg hover:shadow-[#b47f47]/40'
            }`}
        >
          SUBMIT
        </button>
      </div>

      {/* Result Feedback with Scale Animation */}
      {isCorrect === true && (
        <div className="mt-3 animate-scale-in">
          <p className="text-green-400 font-bold flex items-center gap-2 text-sm bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
            <CheckCircle className="w-6 h-6" />
            CORRECT! Brilliant guess!
          </p>
        </div>
      )}
      {isCorrect === false && (
        <div className="mt-3 animate-scale-in">
          <p className="text-red-400 font-bold flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            <XCircle className="w-6 h-6" />
            Not quite. Try again!
          </p>
        </div>
      )}
    </form>
  )
}

