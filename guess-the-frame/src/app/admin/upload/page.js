// src/app/admin/upload/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminUploadPage() {
  const [tmdbId, setTmdbId] = useState('')
  const [movieTitle, setMovieTitle] = useState('')
  const [movieYear, setMovieYear] = useState('')
  const [genre, setGenre] = useState('hollywood')
  const [packId, setPackId] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [fetchingMovie, setFetchingMovie] = useState(false)
  const [packs, setPacks] = useState([])

  // Fetch available packs
  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      const { data } = await supabase
        .from('packs')
        .select('*')
        .order('name')
      setPacks(data || [])
    } catch (error) {
      console.error('Error fetching packs:', error)
    }
  }

  // Fetch movie details from TMDb via our API route
  const fetchMovieFromTMDb = async () => {
    if (!tmdbId) {
      setMessage({ type: 'error', text: 'Please enter a TMDb ID' })
      return
    }

    setFetchingMovie(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`/api/tmdb-fetch?id=${tmdbId}`)

      console.log('API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Movie not found')
      }

      const data = await response.json()
      console.log('Movie data:', data)
      
      setMovieTitle(data.title)
      setMovieYear(data.year.toString())
      setMessage({ 
        type: 'success', 
        text: `✅ Found: ${data.title} (${data.year})` 
      })
    } catch (error) {
      console.error('Fetch error:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ Failed to fetch movie: ${error.message}` 
      })
    } finally {
      setFetchingMovie(false)
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' })
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // File is valid
    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    
    // Clear any previous error messages
    if (message.type === 'error') {
      setMessage({ type: '', text: '' })
    }
  }

  // Upload frame to Supabase
  const handleUpload = async (e) => {
    e.preventDefault()

    // Detailed validation with specific error messages
    if (!tmdbId || !tmdbId.trim()) {
      setMessage({ type: 'error', text: '❌ Please enter a TMDb ID' })
      return
    }

    if (!movieTitle || !movieTitle.trim()) {
      setMessage({ type: 'error', text: '❌ Please enter a movie title' })
      return
    }

    if (!movieYear || !movieYear.trim()) {
      setMessage({ type: 'error', text: '❌ Please enter a release year' })
      return
    }

    if (!imageFile) {
      setMessage({ type: 'error', text: '❌ Please select an image file' })
      return
    }

    setLoading(true)
    setMessage({ type: 'info', text: '⏳ Uploading...' })

    try {
      // Step 1: Check if movie exists in database
      const { data: existingMovie } = await supabase
        .from('movies')
        .select('id')
        .eq('tmdb_id', parseInt(tmdbId))
        .maybeSingle()

      let movieId

      if (existingMovie) {
        movieId = existingMovie.id
        console.log('Movie already exists:', movieId)
      } else {
        // Step 2: Create movie entry
        const { data: newMovie, error: movieError } = await supabase
          .from('movies')
          .insert({
            tmdb_id: parseInt(tmdbId),
            title: movieTitle.trim(),
            year: parseInt(movieYear),
            genre: genre,
            poster_path: null
          })
          .select()
          .single()

        if (movieError) {
          console.error('Movie insert error:', movieError)
          throw new Error(`Database error: ${movieError.message}`)
        }

        movieId = newMovie.id
        console.log('Created new movie:', movieId)
      }

      // Step 3: Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${tmdbId}_${Date.now()}.${fileExt}`

      console.log('Uploading image:', fileName)

      const { error: uploadError } = await supabase.storage
        .from('movie-frames')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Step 4: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('movie-frames')
        .getPublicUrl(fileName)

      console.log('Public URL:', publicUrl)

      // Step 5: Create frame entry
      const { error: frameError } = await supabase
        .from('frames')
        .insert({
          movie_id: movieId,
          image_url: publicUrl,
          pack_id: packId || null
        })

      if (frameError) {
        console.error('Frame insert error:', frameError)
        throw new Error(`Frame save failed: ${frameError.message}`)
      }

      // Success!
      setMessage({ 
        type: 'success', 
        text: `✅ Successfully uploaded frame for "${movieTitle}"!` 
      })

      // Reset form
      setTimeout(() => {
        setTmdbId('')
        setMovieTitle('')
        setMovieYear('')
        setGenre('hollywood')
        setPackId('')
        setImageFile(null)
        setImagePreview(null)
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ 
        type: 'error', 
        text: `❌ ${error.message}` 
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
            🎬 Upload Movie Frame
          </h1>
          <p className="text-gray-300 text-lg">
            Add new movie frames to the database
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/admin"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ← Admin Dashboard
          </Link>
          <Link
            href="/admin/frames"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            View Frames
          </Link>
          <Link
            href="/admin/packs"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Manage Packs
          </Link>
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
                type="text"
                value={tmdbId}
                onChange={(e) => setTmdbId(e.target.value)}
                placeholder="e.g., 155 (for The Dark Knight)"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
              Find the TMDb ID from the URL: themoviedb.org/movie/<strong>155</strong>
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
            />
          </div>

          {/* Movie Year */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Release Year *
            </label>
            <input
              type="text"
              value={movieYear}
              onChange={(e) => setMovieYear(e.target.value)}
              placeholder="e.g., 2008"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
            >
              <option value="hollywood">🎬 Hollywood</option>
              <option value="bollywood">🎭 Bollywood</option>
              <option value="both">🌍 Both</option>
            </select>
          </div>

          {/* Pack Assignment (Optional) */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">
              Assign to Pack (Optional)
            </label>
            <select
              value={packId}
              onChange={(e) => setPackId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">None - Just add to general pool</option>
              {packs.map(pack => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.frame_count || 0} frames)
                </option>
              ))}
            </select>
            <p className="text-gray-400 text-sm mt-2">
              Organize frames into themed collections
            </p>
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
            />
            <p className="text-gray-400 text-sm mt-2">
              Max size: 5MB • Formats: JPG, PNG, WEBP • Selected: {imageFile?.name || 'None'}
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">
                Preview
              </label>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-green-500">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ✓ Image Ready
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg font-medium ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500 text-green-400' 
                : message.type === 'info'
                ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Validation Status */}
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-white font-bold mb-2">Form Status:</p>
            <div className="space-y-1 text-sm">
              <div className={tmdbId ? 'text-green-400' : 'text-gray-500'}>
                {tmdbId ? '✓' : '○'} TMDb ID: {tmdbId || 'Not entered'}
              </div>
              <div className={movieTitle ? 'text-green-400' : 'text-gray-500'}>
                {movieTitle ? '✓' : '○'} Title: {movieTitle || 'Not entered'}
              </div>
              <div className={movieYear ? 'text-green-400' : 'text-gray-500'}>
                {movieYear ? '✓' : '○'} Year: {movieYear || 'Not entered'}
              </div>
              <div className={imageFile ? 'text-green-400' : 'text-gray-500'}>
                {imageFile ? '✓' : '○'} Image: {imageFile ? imageFile.name : 'Not selected'}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !tmdbId || !movieTitle || !movieYear || !imageFile}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? '⏳ Uploading...' : imageFile ? '✅ Upload Frame' : '⚠️ Select an Image First'}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
          <h2 className="text-white font-bold text-xl mb-4">📋 How to Upload</h2>
          <ol className="text-gray-300 space-y-2">
            <li>1. Enter TMDb ID and click "Fetch Info" (or enter manually)</li>
            <li>2. Select genre (Hollywood/Bollywood/Both)</li>
            <li>3. (Optional) Assign to a pack for themed collections</li>
            <li>4. Click "Choose File" and select a movie screenshot</li>
            <li>5. Verify the preview appears</li>
            <li>6. Click "Upload Frame"</li>
          </ol>
        </div>
      </div>
    </div>
  )
}