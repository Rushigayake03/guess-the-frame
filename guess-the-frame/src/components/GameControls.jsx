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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-base font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] hover:from-blue-500 hover:to-blue-600 active:scale-[0.98]"
        >
          <Search className="h-5 w-5" />
          Reveal Frame
        </button>
      )}

      {isRevealed && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            onClick={onShowAnswer}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-4 py-3 font-bold text-white transition-all transform hover:scale-[1.02] hover:bg-yellow-700 active:scale-[0.98]"
          >
            <Lightbulb className="h-5 w-5" />
            Show Answer
          </button>

          <button
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-bold text-white transition-all transform hover:scale-[1.02] hover:bg-purple-700 active:scale-[0.98]"
          >
            <SkipForward className="h-5 w-5" />
            Next Frame
          </button>
        </div>
      )}

      {showingAnswer && correctAnswer && (
        <div className="rounded-xl bg-gradient-to-r from-purple-700 to-orange-700 p-3 text-center">
          <p className="text-sm text-orange-100 mb-1">Correct Answer:</p>
          <p className="text-lg font-bold text-white sm:text-xl">{correctAnswer}</p>
        </div>
      )}
    </div>
  )
}
