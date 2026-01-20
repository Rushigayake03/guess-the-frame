// components/ScorePopup.jsx
'use client'

import { useEffect, useState } from 'react'

export default function ScorePopup({ points, show, onComplete }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show && points > 0) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, points, onComplete])

  if (!visible) return null

  const getColor = () => {
    if (points >= 15) return 'from-green-500 to-emerald-500'
    if (points >= 12) return 'from-blue-500 to-cyan-500'
    return 'from-yellow-500 to-orange-500'
  }

  const getMessage = () => {
    if (points >= 15) return '🔥 AMAZING!'
    if (points >= 12) return '⚡ GREAT!'
    return '👍 NICE!'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`bg-gradient-to-r ${getColor()} text-white px-12 py-8 rounded-3xl shadow-2xl animate-bounce`}>
        <p className="text-2xl font-bold mb-2 text-center">{getMessage()}</p>
        <p className="text-6xl font-black text-center">+{points}</p>
        <p className="text-sm text-center mt-2 opacity-90">points earned</p>
      </div>
    </div>
  )
}