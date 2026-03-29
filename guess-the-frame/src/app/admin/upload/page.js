// src/app/admin/upload/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import AdminHeader from '@/components/AdminHeader'

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      setImageFile(null)
      setImagePreview(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' })
      setImageFile(null)
      setImagePreview(null)
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    if (message.type === 'error') {
      setMessage({ type: '', text: '' })
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

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

      const {
        data: { publicUrl }
      } = supabase.storage
        .from('movie-frames')
        .getPublicUrl(fileName)

      console.log('Public URL:', publicUrl)

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

      setMessage({
        type: 'success',
        text: `✅ Successfully uploaded frame for "${movieTitle}"!`
      })

      setTimeout(() => {
        setTmdbId('')
        setMovieTitle('')
        setMovieYear('')
        setGenre('hollywood')
        setPackId('')
        setImageFile(null)
        setImagePreview(null)

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
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#FDFBD4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <AdminHeader />

          <div className="mb-8 text-center sm:mb-10 lg:mb-12">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              🎬 Upload Movie Frame
            </h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Add new movie frames to the database
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 sm:mb-8">
            <Link
              href="/admin"
              className="rounded-lg bg-gray-700 px-4 py-2.5 font-bold text-white transition hover:bg-gray-600"
            >
              ← Admin Dashboard
            </Link>
            <Link
              href="/admin/frames"
              className="rounded-lg bg-purple-600 px-4 py-2.5 font-bold text-white transition hover:bg-purple-700"
            >
              View Frames
            </Link>
            <Link
              href="/admin/packs"
              className="rounded-lg bg-green-600 px-4 py-2.5 font-bold text-white transition hover:bg-green-700"
            >
              Manage Packs
            </Link>
          </div>

          <form onSubmit={handleUpload} className="rounded-2xl bg-gray-800 p-5 shadow-2xl sm:p-6 lg:p-8">
            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                TMDb Movie ID *
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={tmdbId}
                  onChange={(e) => setTmdbId(e.target.value)}
                  placeholder="e.g., 155 (for The Dark Knight)"
                  className="w-full flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={fetchMovieFromTMDb}
                  disabled={fetchingMovie || !tmdbId}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-700 sm:w-auto"
                >
                  {fetchingMovie ? '🔄 Fetching...' : '🔍 Fetch Info'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Find the TMDb ID from the URL: themoviedb.org/movie/<strong>155</strong>
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                Movie Title *
              </label>
              <input
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                placeholder="e.g., The Dark Knight"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                Release Year *
              </label>
              <input
                type="text"
                value={movieYear}
                onChange={(e) => setMovieYear(e.target.value)}
                placeholder="e.g., 2008"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                Genre *
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="hollywood">🎬 Hollywood</option>
                <option value="bollywood">🎭 Bollywood</option>
                <option value="both">🌍 Both</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                Assign to Pack (Optional)
              </label>
              <select
                value={packId}
                onChange={(e) => setPackId(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">None - Just add to general pool</option>
                {packs.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.name} ({pack.frame_count || 0} frames)
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-400">
                Organize frames into themed collections
              </p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-bold text-white">
                Movie Frame Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
              />
              <p className="mt-2 break-words text-sm text-gray-400">
                Max size: 5MB • Formats: JPG, PNG, WEBP • Selected: {imageFile?.name || 'None'}
              </p>
            </div>

            {imagePreview && (
              <div className="mb-6">
                <label className="mb-2 block font-bold text-white">
                  Preview
                </label>
                <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-green-500 bg-gray-900">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white">
                    ✓ Image Ready
                  </div>
                </div>
              </div>
            )}

            {message.text && (
              <div className={`mb-6 rounded-lg p-4 font-medium ${
                message.type === 'success'
                  ? 'border border-green-500 bg-green-500/20 text-green-400'
                  : message.type === 'info'
                  ? 'border border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border border-red-500 bg-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="mb-6 rounded-lg border border-gray-700 bg-gray-900 p-4">
              <p className="mb-2 font-bold text-white">Form Status:</p>
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

            <button
              type="submit"
              disabled={loading || !tmdbId || !movieTitle || !movieYear || !imageFile}
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3.5 text-base font-bold text-white transition-all transform hover:scale-[1.02] hover:from-green-500 hover:to-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 sm:px-8 sm:py-4 sm:text-lg"
            >
              {loading ? '⏳ Uploading...' : imageFile ? '✅ Upload Frame' : '⚠️ Select an Image First'}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800/50 p-5 backdrop-blur sm:mt-8 sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">📋 How to Upload</h2>
            <ol className="space-y-2 text-sm text-gray-300 sm:text-base">
              <li>1. Enter TMDb ID and click &quot;Fetch Info&quot; (or enter manually)</li>
              <li>2. Select genre (Hollywood/Bollywood/Both)</li>
              <li>3. (Optional) Assign to a pack for themed collections</li>
              <li>4. Click &quot;Choose File&quot; and select a movie screenshot</li>
              <li>5. Verify the preview appears</li>
              <li>6. Click &quot;Upload Frame&quot;</li>
            </ol>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
