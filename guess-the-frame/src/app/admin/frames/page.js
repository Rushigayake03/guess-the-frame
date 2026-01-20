// app/admin/frames/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ManageFramesPage() {
  const [frames, setFrames] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchFrames()
  }, [filter])

  const fetchFrames = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('frames')
        .select(`
          *,
          movies (
            id,
            tmdb_id,
            title,
            year,
            genre
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filter
      if (filter !== 'all') {
        query = query.eq('movies.genre', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setFrames(data || [])
    } catch (error) {
      console.error('Error fetching frames:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFrame = async (frameId, imageUrl) => {
    if (!confirm('Are you sure you want to delete this frame?')) return

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/movie-frames/')
      const filePath = urlParts[1]

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('movie-frames')
        .remove([filePath])

      if (storageError) console.error('Storage delete error:', storageError)

      // Delete from database
      const { error: dbError } = await supabase
        .from('frames')
        .delete()
        .eq('id', frameId)

      if (dbError) throw dbError

      // Refresh list
      fetchFrames()
      alert('Frame deleted successfully!')
    } catch (error) {
      alert('Failed to delete frame: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎬 Manage Frames
            </h1>
            <p className="text-gray-400">
              Total frames: {frames.length}
            </p>
          </div>
          <Link
            href="/admin/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            + Upload New Frame
          </Link>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('hollywood')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'hollywood'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎬 Hollywood
          </button>
          <button
            onClick={() => setFilter('bollywood')}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              filter === 'bollywood'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎭 Bollywood
          </button>
        </div>

        {/* Frames Grid */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">
            Loading frames...
          </div>
        ) : frames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl mb-4">No frames uploaded yet</p>
            <Link
              href="/admin/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Upload Your First Frame
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frames.map((frame) => (
              <div
                key={frame.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                {/* Frame Image */}
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={frame.image_url}
                    alt={frame.movies?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Frame Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {frame.movies?.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {frame.movies?.year} • TMDb ID: {frame.movies?.tmdb_id}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      frame.movies?.genre === 'hollywood'
                        ? 'bg-blue-500/20 text-blue-400'
                        : frame.movies?.genre === 'bollywood'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {frame.movies?.genre}
                    </span>
                    <button
                      onClick={() => deleteFrame(frame.id, frame.image_url)}
                      className="text-red-400 hover:text-red-300 text-sm font-bold transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}