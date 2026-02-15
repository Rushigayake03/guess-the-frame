// components/BlurredFrame.jsx
'use client'
import { useState } from 'react'
import { Film, Loader2 } from 'lucide-react'

export default function BlurredFrame({ imageUrl, isRevealed, movieTitle }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="relative w-full">
      {/* Film Strip Decoration - Top */}
      <div className="absolute -top-4 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-80 z-10 rounded-t-lg">
        <div className="flex justify-around items-center h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-black/40 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Main Frame Container */}
      <div className="relative w-full aspect-video max-h-[52vh] bg-black rounded-2xl overflow-hidden shadow-2xl border-4 lg:border-8 border-yellow-600/30">
        {/* Movie Frame Image */}
        <div className={`relative w-full h-full transition-all duration-1000 ease-out ${
          isRevealed ? 'blur-none scale-100' : 'blur-3xl scale-110'
        }`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={isRevealed ? movieTitle : "Blurred movie frame"}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
              <div className="text-center">
                <Film className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-600 text-2xl font-bold">No frame available</p>
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {!imageLoaded && imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <Loader2 className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin" />
              <p className="text-yellow-500 text-xl font-bold">Loading Frame...</p>
            </div>
          </div>
        )}

        {/* Blur Overlay (before reveal) */}
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="text-center px-8 py-6 bg-black/50 rounded-2xl border-2 border-yellow-500/50 backdrop-blur-md">
              <Film className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <p className="text-yellow-400 text-3xl font-black mb-2 uppercase tracking-wider">Frame Hidden</p>
              <p className="text-gray-300 text-lg font-medium">Click "REVEAL" to see the scene</p>
            </div>
          </div>
        )}

        {/* Corner Film Marks */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-500/50"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-500/50"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-500/50"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-500/50"></div>

        {/* Cinematic Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Film Strip Decoration - Bottom */}
      <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-80 z-10 rounded-b-lg">
        <div className="flex justify-around items-center h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-black/40 rounded-sm"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
