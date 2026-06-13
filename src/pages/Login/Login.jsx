import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../../services/firebase'
import { FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.'
    default:
      return 'Unable to sign in. Please try again.'
  }
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/dashboard')
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-visual">
          <div className="login-visual-top">
            <span className="login-brand">
              <FiShield />
              <span>Document Vault</span>
            </span>
          </div>

          <div className="login-visual-bottom">
            <h2>
              Secure your documents,
              <br />
              simplify your life
            </h2>
            <div className="login-dots">
              <span></span>
              <span></span>
              <span className="active"></span>
            </div>
          </div>
        </aside>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <p className="login-form-sub">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </p>

          {error && <p className="login-error">{error}</p>}

          <div className="login-field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={loading}
            />
          </div>

          <div className="login-field login-field-password">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>

          <div className="login-divider">
            <span>Or continue with</span>
          </div>

          <div className="login-providers">
            <button
              type="button"
              className="provider-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FcGoogle />
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
