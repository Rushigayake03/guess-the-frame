// components/AnswerInput.jsx
'use client'

import { useState } from 'react'

export default function AnswerInput({ 
  onSubmit, 
  disabled = false, 
  isCorrect = null,
  placeholder = "Type movie name..."
}) {
  const [answer, setAnswer] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (answer.trim()) {
      onSubmit(answer.trim())
      setAnswer('') // Clear input after submit
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-6 py-4 text-lg rounded-xl border-2 transition-all
            ${disabled 
              ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }
            ${isCorrect === true ? 'border-green-500 bg-green-500/10' : ''}
            ${isCorrect === false ? 'border-red-500 bg-red-500/10' : ''}
            outline-none`}
          autoComplete="off"
          autoFocus={!disabled}
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg font-bold transition-all
            ${disabled || !answer.trim()
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
        >
          Submit
        </button>
      </div>

      {/* Result Feedback */}
      {isCorrect === true && (
        <p className="mt-2 text-green-400 font-medium flex items-center gap-2">
          ✓ Correct! Well done!
        </p>
      )}
      {isCorrect === false && (
        <p className="mt-2 text-red-400 font-medium flex items-center gap-2">
          ✗ Wrong answer. Try again or skip!
        </p>
      )}
    </form>
  )
}