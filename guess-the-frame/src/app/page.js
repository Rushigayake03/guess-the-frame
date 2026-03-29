// src/app/page.js
import Link from 'next/link'
import { Film, Zap, Trophy, Target, Clock, Star, ArrowRight, ChevronDown } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBD4] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-yellow-600/10 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96"></div>
        <div
          className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl animate-pulse sm:h-80 sm:w-80 lg:h-96 lg:w-96"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16 relative z-10">
        {/* Header with Custom Font */}
        <div className="mb-14 text-center animate-slide-in-down sm:mb-16 lg:mb-20">
          <div className="mb-5 flex items-center justify-center gap-4 sm:mb-6">
            <Film className="h-14 w-14 text-yellow-400 animate-pulse sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
          </div>
          <h1
            className="mb-5 text-5xl font-black leading-none tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 drop-shadow-2xl sm:text-6xl lg:mb-6 lg:text-8xl"
            style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
          >
            GUESS THE FRAME
          </h1>
          <p className="mx-auto max-w-3xl text-lg font-bold tracking-wide text-gray-800 sm:text-2xl lg:text-3xl">
            Can you identify the movie from a single frame?
          </p>
          <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 sm:mt-6 sm:w-32 mx-auto"></div>
        </div>

        {/* Game Rules Section */}
        <div className="mx-auto mb-14 max-w-5xl sm:mb-16 lg:mb-20">
          <div className="animate-fade-in rounded-3xl border-2 border-[#c29257]/60 bg-[#fff8dc]/95 p-5 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-center gap-2 sm:mb-8 sm:gap-3">
              <Trophy className="h-7 w-7 text-yellow-400 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              <h2 className="text-center text-2xl font-black uppercase tracking-wide text-[#8D5A2B] sm:text-3xl lg:text-4xl lg:tracking-wider">How to Play</h2>
              <Trophy className="h-7 w-7 text-yellow-400 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:mb-8 lg:gap-6">
              {/* Rule 1 */}
              <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-5 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-blue-400/50 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 rounded-full bg-blue-600 p-2.5 sm:p-3">
                    <Film className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black uppercase text-[#8D5A2B] sm:text-xl">1. Choose Your Mode</h3>
                    <p className="text-sm font-medium text-gray-800 sm:text-base">
                      Select from Hollywood, Bollywood, or Mixed - each with 20 challenging frames
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-5 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-400/50 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 rounded-full bg-purple-600 p-2.5 sm:p-3">
                    <Target className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black uppercase text-[#8D5A2B] sm:text-xl">2. Reveal & Guess</h3>
                    <p className="text-sm font-medium text-gray-800 sm:text-base">
                      Click reveal to see the frame, then type the movie name before time runs out
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-600/20 to-orange-800/20 p-5 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-orange-400/50 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 rounded-full bg-orange-600 p-2.5 sm:p-3">
                    <Clock className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black uppercase text-orange-400 sm:text-xl">3. Beat the Clock</h3>
                    <p className="text-sm font-medium text-gray-800 sm:text-base">
                      You have 20 seconds per frame. Answer within 5 seconds for +5 bonus points!
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-600/20 to-green-800/20 p-5 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-green-400/50 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 rounded-full bg-green-600 p-2.5 sm:p-3">
                    <Star className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-black uppercase text-green-400 sm:text-xl">4. Score Big</h3>
                    <p className="text-sm font-medium text-gray-800 sm:text-base">
                      Correct answers earn 10 points, plus time bonuses. Aim for the highest score!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring Info */}
            <div className="rounded-2xl border-2 border-yellow-600/30 bg-yellow-600/10 p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-center gap-2 sm:gap-3">
                <Zap className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
                <h3 className="text-center text-xl font-black uppercase text-yellow-400 sm:text-2xl">Scoring System</h3>
                <Zap className="h-5 w-5 text-yellow-400 sm:h-6 sm:w-6" />
              </div>
              <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
                <div>
                  <p className="mb-1 text-2xl font-black text-green-400 sm:text-3xl">+15</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 0-5 seconds</p>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-black text-blue-400 sm:text-3xl">+12-14</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 6-10 seconds</p>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-black text-yellow-400 sm:text-3xl">+10-11</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 11-20 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mb-14 grid max-w-5xl grid-cols-1 gap-5 sm:mb-16 md:grid-cols-3 md:gap-6">
          <div className="animate-fade-in rounded-2xl border-2 border-[#c29257]/60 bg-[#fff8dc]/95 p-5 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-yellow-500/50 sm:p-6" style={{ animationDelay: '0.1s' }}>
            <Zap className="mx-auto mb-3 h-10 w-10 text-yellow-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase text-[#8D5A2B] sm:text-xl">Lightning Fast</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Time-based scoring rewards quick thinking and movie knowledge
            </p>
          </div>

          <div className="animate-fade-in rounded-2xl border-2 border-[#b9864e]/55 bg-[#fff8dc]/95 p-5 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-blue-500/50 sm:p-6" style={{ animationDelay: '0.2s' }}>
            <Film className="mx-auto mb-3 h-10 w-10 text-blue-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase text-[#8D5A2B] sm:text-xl">Multiple Modes</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Hollywood, Bollywood, or Mixed - choose your cinema style
            </p>
          </div>

          <div className="animate-fade-in rounded-2xl border-2 border-[#ad7944]/55 bg-[#fff8dc]/95 p-5 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-500/50 sm:p-6" style={{ animationDelay: '0.3s' }}>
            <Trophy className="mx-auto mb-3 h-10 w-10 text-purple-400 sm:h-12 sm:w-12" />
            <h3 className="mb-2 text-lg font-black uppercase text-[#8D5A2B] sm:text-xl">Compete & Win</h3>
            <p className="text-sm font-medium text-gray-800 sm:text-base">
              Track your high scores and challenge yourself to improve
            </p>
          </div>
        </div>

        
        <div id="start-game" className="mx-auto max-w-2xl animate-scale-in">
          <Link 
            href="/play"
            className="group relative inline-flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-500 px-4 text-xl font-black text-black transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/50 sm:h-[4.5rem] sm:px-6 sm:text-2xl lg:h-20 lg:px-8 lg:text-3xl">
            <span className="text-center uppercase tracking-wide sm:tracking-wider">Start Playing Now</span>
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-8 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
              <ArrowRight className="h-8 w-8" />
            </div>
          </Link>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-700 sm:text-sm sm:tracking-widest">
            Choose Your Game Mode
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center sm:mt-12">
          <p className="text-gray-500 text-sm font-medium">
            Test your cinema knowledge | 20 frames per game | Real-time scoring
          </p>
        </div>
      </div>

      <a
        href="#start-game"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#8D5A2B] px-3 py-2 text-xs font-bold text-[#FDFBD4] shadow-lg hover:bg-[#825E34] sm:bottom-8 sm:right-6 sm:px-4 sm:py-3 sm:text-sm"
        aria-label="Scroll to Start Playing button"
      >
        Start
        <ChevronDown className="h-4 w-4" />
      </a>
    </main>
  )
}


