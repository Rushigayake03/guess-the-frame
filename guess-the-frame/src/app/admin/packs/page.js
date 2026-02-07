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
      // Get packs with frame count
      const { data, error } = await supabase
        .from('packs')
        .select(`
          *,
          frames (count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include frame count
      const packsWithCount = data.map(pack => ({
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
        <AdminHeader />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              📦 Manage Packs
            </h1>
            <p className="text-gray-400">
              Create themed collections of movie frames
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              + Create Pack
            </button>
            <Link
              href="/admin/frames"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Manage Frames
            </Link>
            <Link
              href="/"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Pack</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Pack Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., 90s Action Movies"
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this pack..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Genre *</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="hollywood">🎬 Hollywood</option>
                  <option value="bollywood">🎭 Bollywood</option>
                  <option value="mixed">🌍 Mixed</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Create Pack
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Packs List */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">
            Loading packs...
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl mb-4">No packs created yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Create Your First Pack
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition"
              >
                {editingPack === pack.id ? (
                  // Edit Form
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900 text-white rounded"
                      placeholder="Pack Name"
                    />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900 text-white rounded"
                      placeholder="Description"
                      rows="2"
                    />
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({...formData, genre: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900 text-white rounded"
                    >
                      <option value="hollywood">Hollywood</option>
                      <option value="bollywood">Bollywood</option>
                      <option value="mixed">Mixed</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(pack.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition"
                      >
                        ✗ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pack.genre === 'hollywood' ? 'bg-blue-500/20 text-blue-400' :
                        pack.genre === 'bollywood' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {pack.genre}
                      </span>
                    </div>

                    {pack.description && (
                      <p className="text-gray-400 text-sm mb-4">{pack.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                      <div>
                        <div className="text-2xl font-bold text-white">{pack.frame_count}</div>
                        <div className="text-xs text-gray-400">Frames</div>
                      </div>
                      <Link
                        href={`/game?pack=${pack.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                      >
                        ▶ Play
                      </Link>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(pack)}
                        className="flex-1 text-blue-400 hover:text-blue-300 text-sm font-bold transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pack.id)}
                        className="flex-1 text-red-400 hover:text-red-300 text-sm font-bold transition"
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
      </div>
    </AdminAuthGuard>
  )
}