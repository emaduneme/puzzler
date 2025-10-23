'use client'

import { useState } from 'react'

interface FlashcardProps {
  frontText: string
  backText: string
  scriptureRefs?: string[] | null
  onFlip?: (flipped: boolean) => void
}

export default function Flashcard({
  frontText,
  backText,
  scriptureRefs,
  onFlip,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    const newFlipped = !flipped
    setFlipped(newFlipped)
    if (onFlip) {
      onFlip(newFlipped)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleFlip()
    }
  }

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={`relative w-full h-80 md:h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-blue-500 ${
            flipped ? 'invisible' : 'visible'
          }`}
        >
          <div className="text-center">
            <div className="mb-4 text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Question
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
              {frontText}
            </p>
          </div>
          <div className="absolute bottom-6 text-sm text-gray-500">
            Click or press Space to reveal answer
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center border-4 border-blue-700 rotate-y-180 ${
            flipped ? 'visible' : 'invisible'
          }`}
        >
          <div className="text-center text-white">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-90">
              Answer
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-4">
              {backText}
            </p>
            {scriptureRefs && scriptureRefs.length > 0 && (
              <div className="mt-6 space-y-1">
                {scriptureRefs.map((ref, index) => (
                  <div
                    key={index}
                    className="text-sm bg-white bg-opacity-20 rounded-full px-4 py-1 inline-block mx-1"
                  >
                    {ref}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-6 text-sm text-white opacity-75">
            Click or press Space to flip back
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
