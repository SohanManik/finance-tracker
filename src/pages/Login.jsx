import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

function validatePassword(password) {
  const rules = [
    { label: 'At least 8 characters', test: p => p.length >= 8 },
    { label: 'One uppercase letter', test: p => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: p => /[a-z]/.test(p) },
    { label: 'One number', test: p => /[0-9]/.test(p) },
    { label: 'One special character (!@#$%^&*)', test: p => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ]
  return rules.map(rule => ({ ...rule, passed: rule.test(password) }))
}

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const passwordRules = validatePassword(password)
  const allRulesPassed = passwordRules.every(r => r.passed)

  async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setMessage('')

  if (isSignUp) {
    if (!allRulesPassed) {
      setError('Password does not meet all requirements.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
  }

  setLoading(true)

  if (isSignUp) {
    const { error } = await signUp(email, password)
    if (error) {
      setError(error.message)
    } else {
      setShowConfirmation(true)
    }
  } else {
    const { error } = await signIn(email, password)
    if (error) setError('Invalid email or password.')
  }

  setLoading(false)
}

  function handleSwitch() {
    setIsSignUp(!isSignUp)
    setError('')
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  if (showConfirmation) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#17252A' }}>
      <div className="w-full max-w-md p-8 rounded-xl border text-center" style={{ backgroundColor: '#0D1F22', borderColor: '#2B7A78' }}>
        <div className="text-5xl mb-6">📬</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#FEFFFF' }}>
          Check your email
        </h1>
        <p className="text-sm mb-2" style={{ color: '#DEF2F1' }}>
          We sent a confirmation link to
        </p>
        <p className="text-sm font-medium mb-6" style={{ color: '#3AAFA9' }}>
          {email}
        </p>
        <p className="text-sm mb-8" style={{ color: '#9CA3AF' }}>
          Click the link in the email to activate your account, then come back here to sign in.
        </p>
        <button
          onClick={() => {
            setShowConfirmation(false)
            setIsSignUp(false)
            setPassword('')
            setConfirmPassword('')
          }}
          className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#2B7A78', color: '#FEFFFF' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3AAFA9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B7A78'}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  )
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
              placeholder="Type your username"
              required
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78', color: '#DEF2F1' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#3AAFA9' }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Type your password"
                required
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none pr-16"
                style={{ backgroundColor: '#17252A', border: '1px solid #2B7A78', color: '#DEF2F1' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: '#3AAFA9' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Password rules — only show on sign up */}
          {isSignUp && password.length > 0 && (
            <div className="rounded-lg p-3 flex flex-col gap-1.5" style={{ backgroundColor: '#17252A', border: '1px solid #2B7A7840' }}>
              {passwordRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: rule.passed ? '#22C55E' : '#EF4444' }}>
                    {rule.passed ? '✓' : '✗'}
                  </span>
                  <span className="text-xs" style={{ color: rule.passed ? '#22C55E' : '#9CA3AF' }}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm password — only show on sign up */}
          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: '#3AAFA9' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: '#17252A',
                  border: `1px solid ${confirmPassword.length > 0
                    ? confirmPassword === password ? '#22C55E' : '#EF4444'
                    : '#2B7A78'}`,
                  color: '#DEF2F1'
                }}
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}
              {confirmPassword.length > 0 && confirmPassword === password && (
                <p className="text-xs" style={{ color: '#22C55E' }}>Passwords match</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm" style={{ color: '#3AAFA9' }}>{message}</p>}

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
            onClick={handleSwitch}
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