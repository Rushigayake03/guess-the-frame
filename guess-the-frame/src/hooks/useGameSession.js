// hooks/useGameSession.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkAnswer } from '@/lib/answer-matching'
import { calculateScore } from '@/lib/utils'

export function useGameSession(gameMode = 'mixed', totalFrames = 20) {
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
  const [sessionId, setSessionId] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  // Fetch frames from Supabase on mount
  useEffect(() => {
    fetchFrames()
  }, [gameMode])

  const fetchFrames = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Fetching frames for mode:', gameMode)

      // Build query based on game mode
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

      // Filter by genre
      if (gameMode === 'hollywood') {
        query = query.eq('movies.genre', 'hollywood')
      } else if (gameMode === 'bollywood') {
        query = query.eq('movies.genre', 'bollywood')
      }
      // For 'mixed', no filter needed

      const { data, error: fetchError } = await query

      console.log('Fetched data:', data)
      console.log('Fetch error:', fetchError)

      if (fetchError) throw fetchError

      if (!data || data.length === 0) {
        setError('No frames available for this game mode. Please upload some frames first!')
        setLoading(false)
        return
      }

      // Shuffle frames randomly
      const shuffled = data.sort(() => Math.random() - 0.5)

      // Take only the number we need
      const selectedFrames = shuffled.slice(0, Math.min(totalFrames, shuffled.length))

      console.log('Selected frames:', selectedFrames.length)
      setFrames(selectedFrames)

      // Create game session in database
      const { data: session, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          game_mode: gameMode,
          is_multiplayer: false,
          total_frames: selectedFrames.length
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Session error:', sessionError)
      } else {
        setSessionId(session.id)
      }

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

    // Record reveal time in database
    if (sessionId && currentFrame) {
      supabase.from('game_frames').insert({
        session_id: sessionId,
        frame_id: currentFrame.id,
        frame_number: currentFrameIndex + 1,
        revealed_at: new Date().toISOString()
      })
    }
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

    // Save to database
    if (sessionId && currentFrame) {
      await supabase
        .from('game_frames')
        .update({
          user_answer: userAnswer,
          is_correct: result.isCorrect,
          time_taken: elapsedTime,
          points_earned: points,
          answered_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .eq('frame_id', currentFrame.id)
    }

    return { isCorrect: result.isCorrect, points }
  }

  // Handle time up
  const handleTimeUp = async () => {
    setTimerActive(false)
    setAnswerResult(false)

    // Save timeout to database
    if (sessionId && currentFrame) {
      await supabase
        .from('game_frames')
        .update({
          user_answer: null,
          is_correct: false,
          time_taken: 20,
          points_earned: 0,
          answered_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .eq('frame_id', currentFrame.id)
    }
  }

  // Handle next frame
  const handleNextFrame = async () => {
    if (currentFrameIndex + 1 >= frames.length) {
      // Game complete - update session
      if (sessionId) {
        await supabase
          .from('game_sessions')
          .update({
            final_score: score,
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId)
      }
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