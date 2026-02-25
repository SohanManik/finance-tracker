import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useTheme } from '../lib/ThemeContext'

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
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth()
  const { theme } = useTheme()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationType, setConfirmationType] = useState('signup')

  const passwordRules = validatePassword(password)
  const allRulesPassed = passwordRules.every(r => r.passed)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (isForgotPassword) {
      setLoading(true)
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setConfirmationType('reset')
        setShowConfirmation(true)
      }
      setLoading(false)
      return
    }

    if (isSignUp) {
      if (!allRulesPassed) {
        setError('Password does not meet all requirements.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (!fullName.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (!birthDate) {
        setError('Please enter your date of birth.')
        return
      }
    }

    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName, birthDate)
      if (error) {
        setError(error.message)
      } else {
        setConfirmationType('signup')
        setShowConfirmation(true)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) setError('Invalid email or password.')
    }

    setLoading(false)
  }

  async function handleGoogleSignIn() {
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  function handleSwitch() {
    setIsSignUp(!isSignUp)
    setIsForgotPassword(false)
    setError('')
    setMessage('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setBirthDate('')
  }

  function handleForgotPassword() {
    setIsForgotPassword(true)
    setIsSignUp(false)
    setError('')
    setMessage('')
    setPassword('')
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <div className="w-full max-w-md p-8 rounded-xl border text-center" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
          <div className="text-5xl mb-6">{confirmationType === 'reset' ? '🔐' : '📬'}</div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: theme.textPrimary }}>
            Check your email
          </h1>
          <p className="text-sm mb-2" style={{ color: theme.textSecondary }}>
            {confirmationType === 'reset'
              ? 'We sent a password reset link to'
              : 'We sent a confirmation link to'}
          </p>
          <p className="text-sm font-medium mb-6" style={{ color: theme.accent }}>{email}</p>
          <p className="text-sm mb-8" style={{ color: theme.textMuted }}>
            {confirmationType === 'reset'
              ? 'Click the link in the email to reset your password, then come back to sign in.'
              : 'Click the link in the email to activate your account, then come back here to sign in.'}
          </p>
          <button
            onClick={() => {
              setShowConfirmation(false)
              setIsForgotPassword(false)
              setIsSignUp(false)
              setPassword('')
              setConfirmPassword('')
              setFullName('')
              setBirthDate('')
            }}
            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: theme.accent, color: theme.textPrimary }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.accentHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.accent}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
      <div className="w-full max-w-md p-8 rounded-xl border" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: theme.textPrimary }}>
          Finance Tracker
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: theme.textMuted }}>
          {isForgotPassword
            ? 'Reset your password'
            : isSignUp
            ? 'Create your account'
            : 'Sign in to your account'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: theme.textSecondary }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>

          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.textSecondary }}>Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Sohan Manik"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              />
            </div>
          )}

          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.textSecondary }}>Date of birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              />
            </div>
          )}

          {!isForgotPassword && (
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.textSecondary }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none pr-16"
                  style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: theme.accent }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs underline self-end mt-1"
                  style={{ color: theme.accent }}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {isSignUp && password.length > 0 && (
            <div className="rounded-lg p-3 flex flex-col gap-1.5" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.borderFaint}` }}>
              {passwordRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: rule.passed ? theme.income : theme.expense }}>
                    {rule.passed ? '✓' : '✗'}
                  </span>
                  <span className="text-xs" style={{ color: rule.passed ? theme.income : theme.textMuted }}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isSignUp && (
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: theme.textSecondary }}>Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{
                  backgroundColor: theme.bg,
                  border: `1px solid ${confirmPassword.length > 0
                    ? confirmPassword === password ? theme.income : theme.expense
                    : theme.border}`,
                  color: theme.textPrimary
                }}
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs" style={{ color: theme.expense }}>Passwords do not match</p>
              )}
              {confirmPassword.length > 0 && confirmPassword === password && (
                <p className="text-xs" style={{ color: theme.income }}>Passwords match</p>
              )}
            </div>
          )}

          {error && <p className="text-sm" style={{ color: theme.expense }}>{error}</p>}
          {message && <p className="text-sm" style={{ color: theme.accent }}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
            style={{ backgroundColor: theme.accent, color: theme.bgSecondary }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.accentHover}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.accent}
          >
            {loading
              ? 'Please wait...'
              : isForgotPassword
              ? 'Send Reset Link'
              : isSignUp
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        {!isSignUp && !isForgotPassword && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }}></div>
              <span className="text-xs" style={{ color: theme.textMuted }}>OR</span>
              <div className="flex-1 h-px" style={{ backgroundColor: theme.border }}></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-3"
              style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.borderFaint}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.bg}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="text-sm text-center mt-6" style={{ color: theme.textMuted }}>
          {isForgotPassword ? (
            <button
              onClick={() => { setIsForgotPassword(false); setError('') }}
              className="underline"
              style={{ color: theme.textPrimary }}
            >
              Back to Sign In
            </button>
          ) : isSignUp ? (
            <>Already have an account?{' '}
              <button onClick={handleSwitch} className="underline" style={{ color: theme.textPrimary }}>
                Sign in
              </button>
            </>
          ) : (
            <>Don't have an account?{' '}
              <button onClick={handleSwitch} className="underline" style={{ color: theme.textPrimary }}>
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}