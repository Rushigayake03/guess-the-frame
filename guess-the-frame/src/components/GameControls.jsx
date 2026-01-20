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
    <div className="flex flex-col gap-3 w-full">
      {/* Reveal Button (only shown before reveal) */}
      {!isRevealed && (
        <button
          onClick={onReveal}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          🔍 Reveal Frame
        </button>
      )}

      {/* Action Buttons (shown after reveal) */}
      {isRevealed && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onShowAnswer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
          >
            💡 Show Answer
          </button>

          <button
            onClick={onNext}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
          >
            ⏭️ Next Frame
          </button>
        </div>
      )}

      {/* Answer Display */}
      {showingAnswer && correctAnswer && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl text-center">
          <p className="text-sm text-white/80 mb-1">Correct Answer:</p>
          <p className="text-2xl font-bold text-white">{correctAnswer}</p>
        </div>
      )}
    </div>
  )
}