// src/app/admin/packs/page.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminAuthGuard from '@/components/AdminAuthGuard'
import AdminHeader from '@/components/AdminHeader'

export default function ManagePacksPage() {
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPack, setEditingPack] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: 'hollywood'
  })

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('packs')
        .select(`
          *,
          frames (count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const packsWithCount = data.map((pack) => ({
        ...pack,
        frame_count: pack.frames?.[0]?.count || 0
      }))

      setPacks(packsWithCount)
    } catch (error) {
      console.error('Error fetching packs:', error)
      alert('Failed to load packs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('packs')
        .insert({
          name: formData.name,
          description: formData.description,
          genre: formData.genre,
          frame_count: 0
        })

      if (error) throw error

      alert('Pack created successfully!')
      setShowCreateForm(false)
      setFormData({ name: '', description: '', genre: 'hollywood' })
      fetchPacks()
    } catch (error) {
      alert('Failed to create pack: ' + error.message)
    }
  }

  const handleUpdate = async (packId) => {
    try {
      const { error } = await supabase
        .from('packs')
        .update({
          name: formData.name,
          description: formData.description,
          genre: formData.genre
        })
        .eq('id', packId)

      if (error) throw error

      alert('Pack updated successfully!')
      setEditingPack(null)
      setFormData({ name: '', description: '', genre: 'hollywood' })
      fetchPacks()
    } catch (error) {
      alert('Failed to update pack: ' + error.message)
    }
  }

  const handleDelete = async (packId) => {
    if (!confirm('Delete this pack? Frames will NOT be deleted, just unassigned.')) return

    try {
      const { error } = await supabase
        .from('packs')
        .delete()
        .eq('id', packId)

      if (error) throw error

      alert('Pack deleted successfully!')
      fetchPacks()
    } catch (error) {
      alert('Failed to delete pack: ' + error.message)
    }
  }

  const startEdit = (pack) => {
    setEditingPack(pack.id)
    setFormData({
      name: pack.name,
      description: pack.description || '',
      genre: pack.genre
    })
  }

  const cancelEdit = () => {
    setEditingPack(null)
    setShowCreateForm(false)
    setFormData({ name: '', description: '', genre: 'hollywood' })
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#FDFBD4] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <AdminHeader />

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                📦 Manage Packs
              </h1>
              <p className="text-gray-700">
                Create themed collections of movie frames
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700"
              >
                + Create Pack
              </button>
              <Link
                href="/admin/frames"
                className="rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Manage Frames
              </Link>
              <Link
                href="/"
                className="rounded-lg bg-gray-700 px-4 py-3 font-bold text-white transition hover:bg-gray-600"
              >
                ← Home
              </Link>
            </div>
          </div>

          {showCreateForm && (
            <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-5 sm:mb-8 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">Create New Pack</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-white">Pack Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 90s Action Movies"
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-white">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this pack..."
                    rows="3"
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-white">Genre *</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                    required
                  >
                    <option value="hollywood">🎬 Hollywood</option>
                    <option value="bollywood">🎭 Bollywood</option>
                    <option value="mixed">🌍 Mixed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                  >
                    Create Pack
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 rounded-lg bg-gray-600 py-3 font-bold text-white transition hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-xl text-gray-900">
              Loading packs...
            </div>
          ) : packs.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-xl text-gray-700">No packs created yet</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
              >
                Create Your First Pack
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  className="rounded-xl border border-gray-700 bg-gray-800 p-5 transition hover:border-gray-600 sm:p-6"
                >
                  {editingPack === pack.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                        placeholder="Pack Name"
                      />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                        placeholder="Description"
                        rows="2"
                      />
                      <select
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        className="w-full rounded bg-gray-900 px-3 py-2 text-white"
                      >
                        <option value="hollywood">Hollywood</option>
                        <option value="bollywood">Bollywood</option>
                        <option value="mixed">Mixed</option>
                      </select>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => handleUpdate(pack.id)}
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
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                        <span className={`w-fit rounded px-2 py-1 text-xs font-bold ${
                          pack.genre === 'hollywood' ? 'bg-blue-500/20 text-blue-400' :
                          pack.genre === 'bollywood' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {pack.genre}
                        </span>
                      </div>

                      {pack.description && (
                        <p className="mb-4 text-sm text-gray-400">{pack.description}</p>
                      )}

                      <div className="mb-4 flex flex-col gap-3 border-b border-gray-700 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">{pack.frame_count}</div>
                          <div className="text-xs text-gray-400">Frames</div>
                        </div>
                        <Link
                          href={`/game?pack=${pack.id}`}
                          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                        >
                          ▶ Play
                        </Link>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => startEdit(pack)}
                          className="flex-1 text-sm font-bold text-blue-400 transition hover:text-blue-300"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pack.id)}
                          className="flex-1 text-sm font-bold text-red-400 transition hover:text-red-300"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAuthGuard>
  )
}
