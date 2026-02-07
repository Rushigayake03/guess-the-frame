// components/ScorePopup.jsx
'use client'
import { useEffect, useState } from 'react'

export default function ScorePopup({ points, show, onComplete }) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show && points > 0) {
      setVisible(true)
      
      // Create particle burst effect
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (360 / 12) * i,
        delay: i * 0.05
      }))
      setParticles(newParticles)

      // Play celebration sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3')
      audio.volume = 0.4
      audio.play().catch(e => console.log('Audio play failed:', e))

      const timer = setTimeout(() => {
        setVisible(false)
        setParticles([])
        onComplete?.()
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [show, points, onComplete])

  if (!visible) return null

  const getColor = () => {
    if (points >= 15) return 'from-yellow-400 via-yellow-500 to-orange-500'
    if (points >= 12) return 'from-blue-400 via-blue-500 to-cyan-500'
    return 'from-green-400 via-green-500 to-emerald-500'
  }

  const getMessage = () => {
    if (points >= 15) return '🎬 BLOCKBUSTER!'
    if (points >= 12) return '⭐ OUTSTANDING!'
    return '🎯 WELL DONE!'
  }

  const getGlow = () => {
    if (points >= 15) return 'shadow-yellow-500/50'
    if (points >= 12) return 'shadow-blue-500/50'
    return 'shadow-green-500/50'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle"
          style={{
            animationDelay: `${particle.delay}s`,
            '--angle': `${particle.angle}deg`
          }}
        >
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getColor()}`}></div>
        </div>
      ))}

      {/* Score Display with Scale Animation */}
      <div className={`bg-gradient-to-br ${getColor()} text-white px-16 py-10 rounded-3xl shadow-2xl ${getGlow()} animate-scale-pop border-4 border-white/30`}>
        <p className="text-3xl font-black mb-3 text-center tracking-wider animate-pulse">
          {getMessage()}
        </p>
        <p className="text-8xl font-black text-center drop-shadow-2xl animate-bounce-once">
          +{points}
        </p>
        <p className="text-lg text-center mt-3 font-bold opacity-90 uppercase tracking-widest">
          Points Earned
        </p>
      </div>

      {/* Radial Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-radial ${getColor()} opacity-20 animate-ping-slow`}></div>
    </div>
  )
}