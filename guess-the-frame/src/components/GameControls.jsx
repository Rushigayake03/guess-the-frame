// components/GameControls.jsx
'use client'

import { Lightbulb, Search, SkipForward } from 'lucide-react'

export default function GameControls({
  onReveal,
  onNext,
  onShowAnswer,
  isRevealed = false,
  canSubmit = false,
  correctAnswer = null,
  showingAnswer = false
}) {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {!isRevealed && (
        <button
          onClick={onReveal}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg inline-flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          Reveal Frame
        </button>
      )}

      {isRevealed && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onShowAnswer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <Lightbulb className="h-5 w-5" />
            Show Answer
          </button>

          <button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <SkipForward className="h-5 w-5" />
            Next Frame
          </button>
        </div>
      )}

      {showingAnswer && correctAnswer && (
        <div className="bg-gradient-to-r from-purple-700 to-orange-700 p-3 rounded-xl text-center">
          <p className="text-sm text-orange-100 mb-1">Correct Answer:</p>
          <p className="text-xl font-bold text-white">{correctAnswer}</p>
        </div>
      )}
    </div>
  )
}
