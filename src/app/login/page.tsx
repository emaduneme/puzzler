import AuthForm from '@/components/AuthForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 hover:opacity-80 transition">
        <span className="text-4xl">📖</span>
        <h1 className="text-3xl font-bold text-gray-800">KnowingApp</h1>
      </Link>

      <AuthForm mode="login" />

      <div className="mt-6 text-center text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
