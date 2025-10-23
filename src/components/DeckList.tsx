'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Deck {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  questionCount: number
}

export default function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchDecks()
  }, [selectedCategory])

  const fetchDecks = async () => {
    try {
      setLoading(true)
      const url =
        selectedCategory !== 'all'
          ? `/api/decks?category=${encodeURIComponent(selectedCategory)}`
          : '/api/decks'

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch decks')
      }

      setDecks(data.decks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Old Testament', 'New Testament']

  const getCategoryColor = (category: string) => {
    if (category === 'Old Testament') return 'bg-amber-100 text-amber-800 border-amber-300'
    if (category === 'New Testament') return 'bg-sky-100 text-sky-800 border-sky-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getDeckIcon = (slug: string) => {
    if (slug.includes('gospel')) return '📖'
    if (slug.includes('prophet')) return '👁️'
    if (slug.includes('pentateuch')) return '📜'
    if (slug.includes('historical')) return '🏛️'
    if (slug.includes('poetry') || slug.includes('wisdom')) return '✨'
    if (slug.includes('epistle') || slug.includes('pauline')) return '✉️'
    if (slug.includes('acts')) return '🔥'
    if (slug.includes('revelation')) return '🌟'
    return '📚'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All Decks' : category}
          </button>
        ))}
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Link
            key={deck.id}
            href={`/quiz/${deck.id}`}
            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{getDeckIcon(deck.slug)}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                    deck.category
                  )}`}
                >
                  {deck.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {deck.name}
              </h3>

              {deck.description && (
                <p className="text-sm text-gray-600 mb-4">{deck.description}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {deck.questionCount} {deck.questionCount === 1 ? 'card' : 'cards'}
                </span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Start →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No decks found for this category.</p>
        </div>
      )}
    </div>
  )
}
