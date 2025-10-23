'use client'

import { useState, useEffect } from 'react'
import Flashcard from './Flashcard'

interface Question {
  id: string
  frontText: string
  backText: string
  scriptureRefs?: string[] | null
  difficulty: number
}

interface QuizViewProps {
  deckId: string
  deckName: string
}

export default function QuizView({ deckId, deckName }: QuizViewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [deckId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/decks/${deckId}/questions?limit=50`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions')
      }

      setQuestions(data.questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (correct: boolean) => {
    const question = questions[currentIndex]
    const token = localStorage.getItem('accessToken')

    if (token) {
      try {
        await fetch('/api/progress/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: question.id,
            correct,
          }),
        })
      } catch (err) {
        console.error('Failed to save progress:', err)
      }
    }

    if (correct) {
      setCorrectCount((c) => c + 1)
    } else {
      setIncorrectCount((c) => c + 1)
    }

    // Move to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1)
        setFlipped(false)
      } else {
        setShowCompleted(true)
      }
    }, 300)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setFlipped(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setFlipped(false)
    setCorrectCount(0)
    setIncorrectCount(0)
    setShowCompleted(false)
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No questions available in this deck.</p>
      </div>
    )
  }

  if (showCompleted) {
    const accuracy =
      correctCount + incorrectCount > 0
        ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
        : 0

    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-gray-800">Quiz Complete!</h2>

          <div className="grid grid-cols-3 gap-4 my-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{accuracy}%</div>
            <div className="text-lg text-gray-600">Accuracy</div>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Review Again
            </button>
            <a
              href="/decks"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition"
            >
              Back to Decks
            </a>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{deckName}</h1>
        <p className="text-gray-600">
          Question {currentIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Score Display */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✓</span>
          <span className="text-lg font-semibold text-green-600">{correctCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✗</span>
          <span className="text-lg font-semibold text-red-600">{incorrectCount}</span>
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        frontText={currentQuestion.frontText}
        backText={currentQuestion.backText}
        scriptureRefs={currentQuestion.scriptureRefs}
        onFlip={setFlipped}
      />

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {flipped && (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Incorrect
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Correct
            </button>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Tip: Press Space or Enter to flip the card</p>
      </div>
    </div>
  )
}
