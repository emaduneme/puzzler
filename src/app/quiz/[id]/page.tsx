'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import QuizView from '@/components/QuizView'
import Link from 'next/link'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [deck, setDeck] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDeck()
  }, [params.id])

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch deck')
      }

      setDeck(data.deck)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Deck not found'}</p>
          <Link
            href="/decks"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Decks
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/decks" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="font-medium text-gray-700">Back to Decks</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <h1 className="text-2xl font-bold text-gray-800">KnowingApp</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <QuizView deckId={deck.id} deckName={deck.name} />
      </main>
    </div>
  )
}
