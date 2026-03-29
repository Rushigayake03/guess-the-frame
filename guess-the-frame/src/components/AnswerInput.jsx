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
    const inputWrapper = document.getElementById('answer-input-wrapper')

    if (isCorrect === false) {
      playSound(false)
      if (!inputWrapper) return undefined

      inputWrapper.classList.remove('animate-shake')
      void inputWrapper.offsetWidth
      inputWrapper.classList.add('animate-shake')

      const timer = setTimeout(() => {
        inputWrapper.classList.remove('animate-shake')
      }, 500)

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
      <div id="answer-input-wrapper" className="relative">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-300 sm:px-5 sm:py-3.5
            backdrop-blur-sm font-medium tracking-wide
            ${disabled 
              ? 'bg-[#e6dcc3] border-[#b9a47f] text-gray-600 cursor-not-allowed' 
              : 'bg-[#efe4c9] border-[#b47f47] text-gray-900 focus:border-[#8D5A2B] focus:ring-4 focus:ring-[#c29158]/30 focus:shadow-lg focus:shadow-[#c29158]/25'
            }
            ${isCorrect === true ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30' : ''}
            ${isCorrect === false ? 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30' : ''}
            outline-none placeholder:text-gray-600 sm:pr-36`}
          autoComplete="off"
          autoFocus={!disabled}
        />
        
        {/* Submit Button with Scale Animation */}
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`mt-3 w-full rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 sm:absolute sm:right-2 sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2 sm:py-2
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
          <p className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm font-bold text-green-400">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            CORRECT! Brilliant guess!
          </p>
        </div>
      )}
      {isCorrect === false && (
        <div className="mt-3 animate-scale-in">
          <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-400">
            <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            Not quite. Try again!
          </p>
        </div>
      )}
    </form>
  )
}

