// app/admin/upload/page.js
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminUploadPage() {
  const [tmdbId, setTmdbId] = useState('')
  const [movieTitle, setMovieTitle] = useState('')
  const [movieYear, setMovieYear] = useState('')
  const [genre, setGenre] = useState('hollywood')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [fetchingMovie, setFetchingMovie] = useState(false)

  // Fetch movie details from TMDb
  const fetchMovieFromTMDb = async () => {
    if (!tmdbId) {
      setMessage({ type: 'error', text: 'Please enter a TMDb ID' })
      return
    }

    setFetchingMovie(true)
    setMessage({ type: '', text: '' })

    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`
      )

      if (!response.ok) {
        throw new Error('Movie not found')
      }

      const data = await response.json()
      
      setMovieTitle(data.title)
      setMovieYear(new Date(data.release_date).getFullYear())
      setMessage({ type: 'success', text: `Found: ${data.title} (${new Date(data.release_date).getFullYear()})` })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch movie from TMDb. Check the ID.' })
    } finally {
      setFetchingMovie(false)
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 5MB' })
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setMessage({ type: '', text: '' })
    }
  }

  // Upload frame to Supabase
  const handleUpload = async (e) => {
    e.preventDefault()

    // Validation
    if (!tmdbId || !movieTitle || !movieYear || !imageFile) {
      setMessage({ type: 'error', text: 'Please fill all fields and select an image' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Step 1: Check if movie exists in database
      let { data: existingMovie, error: fetchError } = await supabase
        .from('movies')
        .select('id')
        .eq('tmdb_id', parseInt(tmdbId))
        .single()

      let movieId

      if (existingMovie) {
        // Movie already exists
        movieId = existingMovie.id
      } else {
        // Step 2: Create movie entry
        const { data: newMovie, error: movieError } = await supabase
          .from('movies')
          .insert({
            tmdb_id: parseInt(tmdbId),
            title: movieTitle,
            year: parseInt(movieYear),
            genre: genre,
            poster_path: null // We can add this later if needed
          })
          .select()
          .single()

        if (movieError) throw movieError
        movieId = newMovie.id
      }

      // Step 3: Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${tmdbId}_${Date.now()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('movie-frames')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // Step 4: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('movie-frames')
        .getPublicUrl(filePath)

      // Step 5: Create frame entry
      const { error: frameError } = await supabase
        .from('frames')
        .insert({
          movie_id: movieId,
          image_url: publicUrl
        })

      if (frameError) throw frameError

      // Success!
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully uploaded frame for "${movieTitle}"!` 
      })

      // Reset form
      setTmdbId('')
      setMovieTitle('')
      setMovieYear('')
      setImageFile(null)
      setImagePreview(null)

    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ 
        type: 'error', 
        text: `Failed to upload: ${error.message}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎬 Admin Upload Tool
          </h1>
          <p className="text-gray-300 text-lg">
            Upload movie frames to the database
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* TMDb ID + Fetch Button */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              TMDb Movie ID *
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={tmdbId}
                onChange={(e) => setTmdbId(e.target.value)}
                placeholder="e.g., 155 (for The Dark Knight)"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              />
              <button
                type="button"
                onClick={fetchMovieFromTMDb}
                disabled={fetchingMovie || !tmdbId}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
              >
                {fetchingMovie ? '🔄 Fetching...' : '🔍 Fetch Info'}
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Find the TMDb ID from <a href="https://www.themoviedb.org" target="_blank" className="text-blue-400 hover:underline">themoviedb.org</a>
            </p>
          </div>

          {/* Movie Title */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Movie Title *
            </label>
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="e.g., The Dark Knight"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Movie Year */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Release Year *
            </label>
            <input
              type="number"
              value={movieYear}
              onChange={(e) => setMovieYear(e.target.value)}
              placeholder="e.g., 2008"
              min="1900"
              max="2030"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Genre */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Genre *
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            >
              <option value="hollywood">🎬 Hollywood</option>
              <option value="bollywood">🎭 Bollywood</option>
              <option value="both">🌍 Both</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Movie Frame Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              Max size: 5MB • Formats: JPG, PNG, WEBP
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                Preview
              </label>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500 text-green-400' 
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Uploading...' : '✅ Upload Frame'}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <h2 className="text-white font-bold text-xl mb-4">📋 How to Upload</h2>
          <ol className="text-gray-300 space-y-2">
            <li>1. Go to <a href="https://www.themoviedb.org" target="_blank" className="text-blue-400 hover:underline">themoviedb.org</a> and search for your movie</li>
            <li>2. Copy the movie ID from the URL (e.g., themoviedb.org/movie/<strong>155</strong> → ID is 155)</li>
            <li>3. Enter the ID and click "Fetch Info" to auto-fill movie details</li>
            <li>4. Select the genre (Hollywood/Bollywood/Both)</li>
            <li>5. Upload a screenshot from the movie (use VLC or any screenshot tool)</li>
            <li>6. Click "Upload Frame" to save to database</li>
          </ol>
        </div>
      </div>
    </div>
  )
}