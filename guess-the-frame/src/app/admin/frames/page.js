// src/app/admin/frames/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import AdminHeader from '@/components/AdminHeader'

export default function ManageFramesPage() {
  const [frames, setFrames] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingMovie, setEditingMovie] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', year: '', genre: '' })

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
            genre,
            original_title
          )
        `)
        .order('created_at', { ascending: false })

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
      const urlParts = imageUrl.split('/movie-frames/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]

        const { error: storageError } = await supabase.storage
          .from('movie-frames')
          .remove([filePath])

        if (storageError) console.error('Storage delete error:', storageError)
      }

      const { error: dbError } = await supabase
        .from('frames')
        .delete()
        .eq('id', frameId)

      if (dbError) throw dbError

      fetchFrames()
      alert('Frame deleted successfully!')
    } catch (error) {
      alert('Failed to delete frame: ' + error.message)
    }
  }

  const startEdit = (movie) => {
    setEditingMovie(movie.id)
    setEditForm({
      title: movie.title,
      year: movie.year,
      genre: movie.genre
    })
  }

  const cancelEdit = () => {
    setEditingMovie(null)
    setEditForm({ title: '', year: '', genre: '' })
  }

  const saveEdit = async (movieId) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({
          title: editForm.title,
          year: parseInt(editForm.year),
          genre: editForm.genre
        })
        .eq('id', movieId)

      if (error) throw error

      alert('Movie updated successfully!')
      setEditingMovie(null)
      fetchFrames()
    } catch (error) {
      alert('Failed to update movie: ' + error.message)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#FDFBD4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <AdminHeader />

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                🎬 Manage Frames
              </h1>
              <p className="font-medium text-gray-700">
                Total frames: {frames.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/packs"
                className="rounded-lg bg-purple-600 px-4 py-3 font-bold text-white transition hover:bg-purple-700"
              >
                📦 Manage Packs
              </Link>
              <Link
                href="/admin/upload"
                className="rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                + Upload New Frame
              </Link>
              <Link
                href="/"
                className="rounded-lg bg-gray-700 px-4 py-3 font-bold text-white transition hover:bg-gray-600"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 sm:mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-5 py-2.5 font-bold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('hollywood')}
              className={`rounded-lg px-5 py-2.5 font-bold transition ${
                filter === 'hollywood'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎬 Hollywood
            </button>
            <button
              onClick={() => setFilter('bollywood')}
              className={`rounded-lg px-5 py-2.5 font-bold transition ${
                filter === 'bollywood'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎭 Bollywood
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xl text-gray-900">
              Loading frames...
            </div>
          ) : frames.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-xl text-gray-700">No frames uploaded yet</p>
              <Link
                href="/admin/upload"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Upload Your First Frame
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {frames.map((frame) => (
                <div
                  key={frame.id}
                  className="overflow-hidden rounded-xl bg-gray-800 shadow-lg transition hover:shadow-2xl"
                >
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={frame.image_url}
                      alt={frame.movies?.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    {editingMovie === frame.movies?.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                          placeholder="Title"
                        />
                        <input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                          className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                          placeholder="Year"
                        />
                        <select
                          value={editForm.genre}
                          onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                          className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                        >
                          <option value="hollywood">Hollywood</option>
                          <option value="bollywood">Bollywood</option>
                          <option value="both">Both</option>
                        </select>
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            onClick={() => saveEdit(frame.movies.id)}
                            className="flex-1 rounded bg-green-600 py-2 text-white transition hover:bg-green-700"
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 rounded bg-gray-600 py-2 text-white transition hover:bg-gray-700"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="mb-1 text-lg font-bold text-white">
                          {frame.movies?.title}
                        </h3>
                        <p className="mb-3 text-sm text-gray-400">
                          {frame.movies?.year} • TMDb: {frame.movies?.tmdb_id}
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                            frame.movies?.genre === 'hollywood'
                              ? 'bg-blue-500/20 text-blue-400'
                              : frame.movies?.genre === 'bollywood'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {frame.movies?.genre}
                          </span>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => startEdit(frame.movies)}
                              className="text-sm font-bold text-blue-400 transition hover:text-blue-300"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteFrame(frame.id, frame.image_url)}
                              className="text-sm font-bold text-red-400 transition hover:text-red-300"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAuthGuard>
  )
}
