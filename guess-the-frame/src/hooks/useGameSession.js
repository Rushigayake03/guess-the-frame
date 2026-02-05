// src/hooks/useGameSession.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkAnswer } from '@/lib/answer-matching'
import { calculateScore } from '@/lib/utils'

export function useGameSession(gameMode = 'mixed', packId = null) {
  const [frames, setFrames] = useState([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [answerResult, setAnswerResult] = useState(null)
  const [showingAnswer, setShowingAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  // Fetch frames from Supabase on mount
  useEffect(() => {
    fetchFrames()
  }, [gameMode, packId])

  const fetchFrames = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Fetching frames for mode:', gameMode, 'pack:', packId)

      // Build query based on game mode and pack
      let query = supabase
        .from('frames')
        .select(`
          id,
          image_url,
          movies (
            id,
            tmdb_id,
            title,
            original_title,
            year,
            genre
          )
        `)

      // Filter by pack if specified
      if (packId) {
        query = query.eq('pack_id', packId)
      }

      // Filter by genre if not using pack
      if (!packId) {
        if (gameMode === 'hollywood') {
          query = query.eq('movies.genre', 'hollywood')
        } else if (gameMode === 'bollywood') {
          query = query.eq('movies.genre', 'bollywood')
        }
      }

      const { data, error: fetchError } = await query

      console.log('Fetched data:', data)

      if (fetchError) throw fetchError

      if (!data || data.length === 0) {
        setError('No frames available for this game mode. Please upload some frames first!')
        setLoading(false)
        return
      }

      // Shuffle frames randomly
      const shuffled = data.sort(() => Math.random() - 0.5)

      // Take up to 20 frames
      const selectedFrames = shuffled.slice(0, Math.min(20, shuffled.length))

      console.log('Selected frames:', selectedFrames.length)
      setFrames(selectedFrames)

    } catch (err) {
      console.error('Error fetching frames:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get current frame
  const currentFrame = frames[currentFrameIndex]

  // Handle reveal
  const handleReveal = () => {
    setIsRevealed(true)
    setTimerActive(true)
    setElapsedTime(0)
  }

  // Handle answer submission
  const handleSubmitAnswer = async (userAnswer) => {
    if (!isRevealed || !timerActive || !currentFrame) return

    setTimerActive(false)

    // Prepare correct answers
    const correctAnswersList = [
      currentFrame.movies.title,
      currentFrame.movies.original_title,
      `${currentFrame.movies.title} (${currentFrame.movies.year})`
    ].filter(Boolean)

    // Check answer
    const result = checkAnswer(userAnswer, correctAnswersList)
    const points = calculateScore(elapsedTime, result.isCorrect)

    setAnswerResult(result.isCorrect)

    if (result.isCorrect) {
      setScore(score + points)
      setCorrectAnswers(correctAnswers + 1)
    }

    return { isCorrect: result.isCorrect, points }
  }

  // Handle time up
  const handleTimeUp = () => {
    setTimerActive(false)
    setAnswerResult(false)
  }

  // Handle next frame
  const handleNextFrame = () => {
    if (currentFrameIndex + 1 >= frames.length) {
      // Game complete
      setGameComplete(true)
      return
    }

    // Move to next frame
    setCurrentFrameIndex(currentFrameIndex + 1)
    setIsRevealed(false)
    setTimerActive(false)
    setElapsedTime(0)
    setAnswerResult(null)
    setShowingAnswer(false)
  }

  // Handle show answer
  const handleShowAnswer = () => {
    setShowingAnswer(true)
    setTimerActive(false)
  }

  return {
    // State
    frames,
    currentFrame,
    currentFrameIndex,
    score,
    correctAnswers,
    isRevealed,
    timerActive,
    elapsedTime,
    answerResult,
    showingAnswer,
    loading,
    error,
    gameComplete,
    totalFrames: frames.length,

    // Actions
    handleReveal,
    handleSubmitAnswer,
    handleTimeUp,
    handleNextFrame,
    handleShowAnswer,
    setElapsedTime,
  }
}