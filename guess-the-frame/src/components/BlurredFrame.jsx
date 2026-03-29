// components/BlurredFrame.jsx
'use client'
import { useEffect, useState } from 'react'
import { Film, Loader2 } from 'lucide-react'

export default function BlurredFrame({ imageUrl, isRevealed, movieTitle }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
  }, [imageUrl])

  return (
    <div className="relative w-full">
      {/* Film Strip Decoration - Top */}
      <div className="absolute -top-3 left-0 right-0 z-10 h-6 rounded-t-lg bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-80 sm:-top-4 sm:h-8">
        <div className="flex justify-around items-center h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-sm bg-black/40 sm:h-4 sm:w-4"></div>
          ))}
        </div>
      </div>

      {/* Main Frame Container */}
      <div className="relative w-full aspect-video max-h-[38vh] rounded-2xl border-4 border-yellow-600/30 bg-black overflow-hidden shadow-2xl sm:max-h-[46vh] lg:max-h-[52vh] lg:border-8">
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
              <div className="text-center px-4">
                <Film className="mx-auto mb-2 h-12 w-12 text-gray-600 sm:h-16 sm:w-16" />
                <p className="text-xl font-bold text-gray-600 sm:text-2xl">No frame available</p>
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {!imageLoaded && imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="px-4 text-center">
              <Loader2 className="mx-auto mb-4 h-14 w-14 text-yellow-500 animate-spin sm:h-20 sm:w-20" />
              <p className="text-lg font-bold text-yellow-500 sm:text-xl">Loading Frame...</p>
            </div>
          </div>
        )}

        {/* Blur Overlay (before reveal) */}
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="mx-4 rounded-2xl border-2 border-yellow-500/50 bg-black/50 px-4 py-4 text-center backdrop-blur-md sm:px-8 sm:py-6">
              <Film className="mx-auto mb-3 h-12 w-12 animate-bounce text-yellow-400 sm:mb-4 sm:h-16 sm:w-16" />
              <p className="mb-2 text-2xl font-black uppercase tracking-wide text-yellow-400 sm:text-3xl sm:tracking-wider">Frame Hidden</p>
              <p className="text-sm font-medium text-gray-300 sm:text-lg">Click "REVEAL" to see the scene</p>
            </div>
          </div>
        )}

        {/* Corner Film Marks */}
        <div className="absolute top-2 left-2 h-4 w-4 border-l-2 border-t-2 border-yellow-500/50 sm:h-6 sm:w-6 sm:border-l-4 sm:border-t-4"></div>
        <div className="absolute top-2 right-2 h-4 w-4 border-r-2 border-t-2 border-yellow-500/50 sm:h-6 sm:w-6 sm:border-r-4 sm:border-t-4"></div>
        <div className="absolute bottom-2 left-2 h-4 w-4 border-l-2 border-b-2 border-yellow-500/50 sm:h-6 sm:w-6 sm:border-l-4 sm:border-b-4"></div>
        <div className="absolute bottom-2 right-2 h-4 w-4 border-r-2 border-b-2 border-yellow-500/50 sm:h-6 sm:w-6 sm:border-r-4 sm:border-b-4"></div>

        {/* Cinematic Vignette Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Film Strip Decoration - Bottom */}
      <div className="absolute -bottom-3 left-0 right-0 z-10 h-6 rounded-b-lg bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 opacity-80 sm:-bottom-4 sm:h-8">
        <div className="flex justify-around items-center h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-sm bg-black/40 sm:h-4 sm:w-4"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
