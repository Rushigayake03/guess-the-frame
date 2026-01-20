// lib/utils.js

// Merge Tailwind classes
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Format time (seconds to MM:SS)
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Calculate score with time bonus
export function calculateScore(timeTaken, isCorrect) {
  if (!isCorrect) return 0
  
  let score = 10 // Base points
  
  // Time bonus
  if (timeTaken <= 5) {
    score += 5 // First 5 seconds: +5 bonus
  } else if (timeTaken <= 10) {
    score += 2 // Next 5 seconds: +2 bonus
  }
  
  return score
}

// Get time bonus amount (for display)
export function getTimeBonus(timeTaken) {
  if (timeTaken <= 5) return 5
  if (timeTaken <= 10) return 2
  return 0
}