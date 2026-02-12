// components/GameControls.jsx
'use client'

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
      {/* Reveal Button (only shown before reveal) */}
      {!isRevealed && (
        <button
          onClick={onReveal}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          🔍 Reveal Frame
        </button>
      )}

      {/* Action Buttons (shown after reveal) */}
      {isRevealed && (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onShowAnswer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            💡 Show Answer
          </button>

          <button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ⏭️ Next Frame
          </button>
        </div>
      )}

      {/* Answer Display */}
      {showingAnswer && correctAnswer && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Correct Answer:</p>
          <p className="text-xl font-bold text-white">{correctAnswer}</p>
        </div>
      )}
    </div>
  )
}

