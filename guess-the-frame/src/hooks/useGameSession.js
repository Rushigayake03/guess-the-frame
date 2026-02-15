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

      // Build query - use !inner to ensure movies exist
      let query = supabase
        .from('frames')
        .select(`
          id,
          image_url,
          movie_id,
          movies!inner (
            id,
            tmdb_id,
            title,
            original_title,
            year,
            genre
          )
        `)
        .not('movies', 'is', null)

      // If pack is specified, filter by pack
      if (packId) {
        query = query.eq('pack_id', packId)
      } else {
        // Otherwise filter by genre in the movies table
        if (gameMode === 'hollywood') {
          // Filter movies where genre is 'hollywood' or 'both'
          query = query.or('genre.eq.hollywood,genre.eq.both', { foreignTable: 'movies' })
        } else if (gameMode === 'bollywood') {
          // Filter movies where genre is 'bollywood' or 'both'
          query = query.or('genre.eq.bollywood,genre.eq.both', { foreignTable: 'movies' })
        }
        // If 'mixed', no genre filter needed
      }

      const { data, error: fetchError } = await query

      console.log('Fetched data:', data)
      console.log('Fetch error:', fetchError)

      if (fetchError) {
        console.error('Supabase error:', fetchError)
        throw fetchError
      }

      if (!data || data.length === 0) {
        setError('No frames available for this game mode. Please upload some frames first!')
        setLoading(false)
        return
      }

      // Verify all frames have movie data
      const validFrames = data.filter(frame => frame.movies && frame.movies.title)
      
      if (validFrames.length === 0) {
        setError('Frames found but missing movie data. Please check your database.')
        setLoading(false)
        return
      }

      console.log('Valid frames with movie data:', validFrames.length)

      // Shuffle frames randomly
      const shuffled = validFrames.sort(() => Math.random() - 0.5)

      // Take up to 20 frames
      const selectedFrames = shuffled.slice(0, Math.min(20, shuffled.length))

      console.log('Selected frames:', selectedFrames.length)
      setFrames(selectedFrames)

    } catch (err) {
      console.error('Error fetching frames:', err)
      setError(err.message || 'Failed to load frames')
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

    // Add null checks for movies object
    if (!currentFrame.movies) {
      console.error('Current frame has no movie data:', currentFrame)
      setAnswerResult(false)
      return { isCorrect: false, points: 0 }
    }

    // Prepare correct answers with null checks
    const correctAnswersList = [
      currentFrame.movies.title,
      currentFrame.movies.original_title,
      currentFrame.movies.year ? `${currentFrame.movies.title} (${currentFrame.movies.year})` : null
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