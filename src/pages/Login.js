import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link.')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#17252A' }}>
      <div className="w-full max-w-md p-8 rounded-xl border" style={{ backgroundColor: '#0D1F22', borderColor: '#2B7A78' }}>
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: '#FEFFFF' }}>
          Finance Tracker
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: '#3AAFA9' }}>
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#3AAFA9' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78', color: '#DEF2F1' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#3AAFA9' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78', color: '#DEF2F1' }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {message && (
            <p className="text-sm" style={{ color: '#3AAFA9' }}>{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
            style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3AAFA9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B7A78'}
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#3AAFA9' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="underline"
            style={{ color: '#FEFFFF' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}