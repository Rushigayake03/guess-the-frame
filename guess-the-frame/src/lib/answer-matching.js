// lib/answer-matching.js

// Normalize string for comparison
function normalize(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '') // Remove articles
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

// Calculate Levenshtein distance (edit distance)
function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Check if answer is correct (with fuzzy matching)
export function checkAnswer(userAnswer, correctAnswers) {
  if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
    return { isCorrect: false, confidence: 0 }
  }

  const normalizedUser = normalize(userAnswer)
  const normalizedCorrect = correctAnswers.map(normalize).filter(Boolean)

  // 1. Exact match after normalization
  if (normalizedCorrect.includes(normalizedUser)) {
    return { isCorrect: true, confidence: 100, matchType: 'exact' }
  }

  // 2. Fuzzy match (allow typos)
  for (const correct of normalizedCorrect) {
    const distance = levenshteinDistance(normalizedUser, correct)
    const maxLength = Math.max(normalizedUser.length, correct.length)
    
    if (maxLength === 0) continue
    
    const similarity = 1 - distance / maxLength

    // If 80% or more similar, accept it
    if (similarity >= 0.8) {
      return { 
        isCorrect: true, 
        confidence: Math.round(similarity * 100),
        matchType: 'fuzzy'
      }
    }
  }

  // 3. Check for partial matches (contains)
  for (const correct of normalizedCorrect) {
    if (correct.includes(normalizedUser) || normalizedUser.includes(correct)) {
      const longer = Math.max(correct.length, normalizedUser.length)
      const shorter = Math.min(correct.length, normalizedUser.length)
      const similarity = shorter / longer
      
      if (similarity >= 0.7) {
        return { 
          isCorrect: true, 
          confidence: Math.round(similarity * 100),
          matchType: 'partial'
        }
      }
    }
  }

  return { isCorrect: false, confidence: 0, matchType: 'none' }
}