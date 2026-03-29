// components/ScorePopup.jsx
'use client'
import { useEffect } from 'react'
import { Star, Sparkles, Award } from 'lucide-react'

export default function ScorePopup({ points, show, onComplete }) {
  const visible = show && points > 0
  const particles = visible
    ? Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (360 / 12) * i,
        delay: i * 0.05
      }))
    : []

  useEffect(() => {
    if (visible) {
      // Play celebration sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3')
      audio.volume = 0.4
      audio.play().catch(e => console.log('Audio play failed:', e))

      const timer = setTimeout(() => {
        onComplete?.()
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [visible, onComplete])

  if (!visible) return null

  const getColor = () => {
    if (points >= 15) return 'from-yellow-400 via-yellow-500 to-orange-500'
    if (points >= 12) return 'from-blue-400 via-blue-500 to-cyan-500'
    return 'from-green-400 via-green-500 to-emerald-500'
  }

  const getMessage = () => {
    if (points >= 15) return { text: 'BLOCKBUSTER!', Icon: Award }
    if (points >= 12) return { text: 'OUTSTANDING!', Icon: Star }
    return { text: 'WELL DONE!', Icon: Sparkles }
  }

  const getGlow = () => {
    if (points >= 15) return 'shadow-yellow-500/50'
    if (points >= 12) return 'shadow-blue-500/50'
    return 'shadow-green-500/50'
  }

  const { text, Icon } = getMessage()

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
      <div className={`mx-4 rounded-3xl border-4 border-white/30 bg-gradient-to-br px-6 py-6 text-white shadow-2xl animate-scale-pop sm:px-10 sm:py-8 lg:px-16 lg:py-10 ${getColor()} ${getGlow()}`}>
        <div className="mb-3 flex items-center justify-center gap-2 sm:gap-3">
          <Icon className="h-7 w-7 animate-pulse sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
          <p className="text-center text-xl font-black tracking-wide sm:text-2xl lg:text-3xl lg:tracking-wider">
            {text}
          </p>
          <Icon className="h-7 w-7 animate-pulse sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
        </div>
        <p className="text-center text-5xl font-black drop-shadow-2xl animate-bounce-once sm:text-6xl lg:text-8xl">
          +{points}
        </p>
        <p className="mt-3 text-center text-sm font-bold uppercase tracking-[0.25em] opacity-90 sm:text-base lg:text-lg lg:tracking-widest">
          Points Earned
        </p>
      </div>

      {/* Radial Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-radial ${getColor()} opacity-20 animate-ping-slow`}></div>
    </div>
  )
}
