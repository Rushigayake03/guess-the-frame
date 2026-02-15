// src/app/page.js
import Link from 'next/link'
import { Film, Zap, Trophy, Target, Clock, Star, ArrowRight, ChevronDown } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBD4] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header with Custom Font */}
        <div className="text-center mb-20 animate-slide-in-down">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Film className="w-20 h-20 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 mb-6 tracking-wider drop-shadow-2xl" style={{fontFamily: 'Impact, "Arial Black", sans-serif'}}>
            GUESS THE FRAME
          </h1>
          <p className="text-3xl text-gray-800 font-bold tracking-wide">
            Can you identify the movie from a single frame?
          </p>
          <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full"></div>
        </div>

        {/* Game Rules Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-[#fff8dc]/95 backdrop-blur-md border-2 border-[#c29257]/60 rounded-3xl p-10 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h2 className="text-4xl font-black text-[#8D5A2B] uppercase tracking-wider">How to Play</h2>
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Rule 1 */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-2 border-blue-500/30 rounded-2xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-blue-400/50">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 rounded-full p-3 flex-shrink-0">
                    <Film className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#8D5A2B] mb-2 uppercase">1. Choose Your Mode</h3>
                    <p className="text-gray-800 font-medium">
                      Select from Hollywood, Bollywood, or Mixed - each with 20 challenging frames
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-2 border-purple-500/30 rounded-2xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-400/50">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full p-3 flex-shrink-0">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#8D5A2B] mb-2 uppercase">2. Reveal & Guess</h3>
                    <p className="text-gray-800 font-medium">
                      Click reveal to see the frame, then type the movie name before time runs out
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-2 border-orange-500/30 rounded-2xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-orange-400/50">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 rounded-full p-3 flex-shrink-0">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-orange-400 mb-2 uppercase">3. Beat the Clock</h3>
                    <p className="text-gray-800 font-medium">
                      You have 20 seconds per frame. Answer within 5 seconds for +5 bonus points!
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-2 border-green-500/30 rounded-2xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-green-400/50">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 rounded-full p-3 flex-shrink-0">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-green-400 mb-2 uppercase">4. Score Big</h3>
                    <p className="text-gray-800 font-medium">
                      Correct answers earn 10 points, plus time bonuses. Aim for the highest score!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring Info */}
            <div className="bg-yellow-600/10 border-2 border-yellow-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-black text-yellow-400 uppercase">Scoring System</h3>
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-black text-green-400 mb-1">+15</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 0-5 seconds</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-blue-400 mb-1">+12-14</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 6-10 seconds</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-yellow-400 mb-1">+10-11</p>
                  <p className="text-gray-800 font-bold text-sm">Answer in 11-20 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#fff8dc]/95 backdrop-blur-md border-2 border-[#c29257]/60 rounded-2xl p-6 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-yellow-500/50 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#8D5A2B] mb-2 uppercase">Lightning Fast</h3>
            <p className="text-gray-800 font-medium">
              Time-based scoring rewards quick thinking and movie knowledge
            </p>
          </div>

          <div className="bg-[#fff8dc]/95 backdrop-blur-md border-2 border-[#b9864e]/55 rounded-2xl p-6 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-blue-500/50 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Film className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#8D5A2B] mb-2 uppercase">Multiple Modes</h3>
            <p className="text-gray-800 font-medium">
              Hollywood, Bollywood, or Mixed - choose your cinema style
            </p>
          </div>

          <div className="bg-[#fff8dc]/95 backdrop-blur-md border-2 border-[#ad7944]/55 rounded-2xl p-6 text-center transition-all duration-300 ease-out hover:scale-[1.02] hover:border-purple-500/50 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#8D5A2B] mb-2 uppercase">Compete & Win</h3>
            <p className="text-gray-800 font-medium">
              Track your high scores and challenge yourself to improve
            </p>
          </div>
        </div>

        
        <div id="start-game" className="max-w-2xl mx-auto animate-scale-in">
          <Link 
            href="/play"
            className="group relative inline-flex h-20 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-500 px-8 text-3xl font-black text-black transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/50">
            <span className="uppercase tracking-wider">Start Playing Now</span>
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-8 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
              <ArrowRight className="h-8 w-8" />
            </div>
          </Link>
          <p className="text-center text-sm font-bold mt-4 text-gray-700 uppercase tracking-widest">
            Choose Your Game Mode
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm font-medium">
            Test your cinema knowledge • 20 frames per game • Real-time scoring
          </p>
        </div>
      </div>

      <a
        href="#start-game"
        className="fixed bottom-8 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#8D5A2B] px-4 py-3 text-sm font-bold text-[#FDFBD4] shadow-lg hover:bg-[#825E34]"
        aria-label="Scroll to Start Playing button"
      >
        Start
        <ChevronDown className="h-4 w-4" />
      </a>
    </main>
  )
}


