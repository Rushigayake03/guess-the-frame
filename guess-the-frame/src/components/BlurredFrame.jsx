// components/BlurredFrame.jsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function BlurredFrame({ imageUrl, isRevealed, movieTitle }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Movie Frame Image */}
      <div className={`relative w-full h-full transition-all duration-700 ${
        isRevealed ? 'blur-none' : 'blur-3xl scale-110'
      }`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={isRevealed ? movieTitle : "Blurred movie frame"}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <p className="text-gray-500 text-xl">No frame available</p>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {!imageLoaded && imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Blur Overlay Text (before reveal) */}
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center">
            <p className="text-white text-2xl font-bold mb-2">🎬 Frame Hidden</p>
            <p className="text-gray-300 text-sm">Click "Reveal" to see the frame</p>
          </div>
        </div>
      )}

      {/* Frame Border */}
      <div className="absolute inset-0 border-4 border-white/10 rounded-2xl pointer-events-none"></div>
    </div>
  )
}