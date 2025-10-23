 'use client'

import DeckList from '@/components/DeckList'
import Link from 'next/link'

export default function DecksPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-3xl">📖</span>
            <h1 className="text-2xl font-bold text-gray-800">KnowingApp</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/progress"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              My Progress
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
                window.location.href = '/'
              }}
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Study Decks</h2>
          <p className="text-lg text-gray-600">
            Choose a deck to begin your Bible study journey
          </p>
        </div>

        <DeckList />
      </main>
    </div>
  )
}
