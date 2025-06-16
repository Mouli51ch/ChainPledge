"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Target, Trophy, Coins, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Navigation } from "@/components/navigation"

const inspirationalQuotes = [
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
]

export default function Dashboard() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + inspirationalQuotes.length) % inspirationalQuotes.length)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-float">
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6">
              <span className="text-gradient">Make a Promise.</span>
              <br />
              <span className="text-white">Stake It.</span>
              <br />
              <span className="text-gradient">Keep It.</span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your goals into unbreakable commitments with the power of blockchain. Stake APT tokens on your
            promises and unlock your potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-4 animate-glow"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Pledge
              </Button>
            </Link>
            <Link href="/pledges">
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-600/20 text-lg px-8 py-4"
              >
                <Target className="w-5 h-5 mr-2" />
                View My Pledges
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">127</h3>
              <p className="text-gray-400 text-lg">Total Pledges</p>
            </GlassCard>

            <GlassCard hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">89</h3>
              <p className="text-gray-400 text-lg">Completed Pledges</p>
            </GlassCard>

            <GlassCard hover className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">2,450</h3>
              <p className="text-gray-400 text-lg">APT Saved</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute top-4 right-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>

            <div className="py-8">
              <blockquote className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
                "{inspirationalQuotes[currentQuote].text}"
              </blockquote>
              <cite className="text-lg text-indigo-400 font-semibold">
                — {inspirationalQuotes[currentQuote].author}
              </cite>
            </div>

            <div className="flex justify-between items-center mt-8">
              <Button variant="ghost" size="sm" onClick={prevQuote} className="text-gray-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex space-x-2">
                {inspirationalQuotes.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuote ? "bg-indigo-500" : "bg-gray-600"
                    }`}
                    onClick={() => setCurrentQuote(index)}
                  />
                ))}
              </div>

              <Button variant="ghost" size="sm" onClick={nextQuote} className="text-gray-400 hover:text-white">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
