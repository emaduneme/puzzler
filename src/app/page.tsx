import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📖</span>
            <h1 className="text-2xl font-bold text-gray-800">KnowingApp</h1>
          </div>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Master Bible Knowledge
              <br />
              <span className="text-blue-600">One Card at a Time</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Interactive flashcard game to help you learn and memorize Bible passages,
              stories, and teachings. Track your progress with intelligent spaced repetition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/decks"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-xl text-lg transition border-2 border-gray-300"
              >
                Browse Decks
              </Link>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 pt-20">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Organized by Topic
                </h3>
                <p className="text-gray-600">
                  Study from categorized decks covering the Old Testament, New Testament,
                  Gospels, Epistles, Prophets, and more.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Smart Learning
                </h3>
                <p className="text-gray-600">
                  Spaced repetition algorithm adapts to your learning pace, showing you
                  cards when you need to review them most.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Track Progress
                </h3>
                <p className="text-gray-600">
                  Monitor your accuracy, streaks, and mastery levels. See your growth
                  over time with detailed statistics.
                </p>
              </div>
            </div>

            {/* Deck Preview */}
            <div className="pt-20">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">
                Available Study Decks
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: '📜', name: 'Pentateuch' },
                  { icon: '📖', name: 'Gospels' },
                  { icon: '👁️', name: 'Prophets' },
                  { icon: '✉️', name: 'Epistles' },
                  { icon: '🏛️', name: 'Historical' },
                  { icon: '✨', name: 'Poetry' },
                  { icon: '🔥', name: 'Acts' },
                  { icon: '🌟', name: 'Revelation' },
                ].map((deck) => (
                  <div
                    key={deck.name}
                    className="bg-white rounded-xl p-4 shadow border border-gray-200"
                  >
                    <div className="text-3xl mb-2">{deck.icon}</div>
                    <div className="text-sm font-semibold text-gray-700">{deck.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 KnowingApp. Built with Next.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
