import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../../services/firebase'
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useState, useEffect } from 'react'
import { loginSlides } from '../../constants/loginSlides'

function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'

    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'

    case 'auth/email-already-in-use':
      return 'An account already exists with this email.'

    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'

    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'

    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.'

    default:
      return 'Unable to continue. Please try again.'
  }
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )
      }

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
  useEffect(() => {
  const timer = setInterval(() => {
    setActiveSlide((prev) => (prev + 1) % loginSlides.length)
  }, 5000)

  return () => clearInterval(timer)
}, [])
const handleForgotPassword = async () => {
  setError('')
  setSuccess('')

  if (!email.trim()) {
    setError('Please enter your email address first.')
    return
  }

  try {
    await sendPasswordResetEmail(auth, email.trim())

    setSuccess(
      'Password reset email sent. Please check your inbox.'
    )
  } catch (err) {
    setError(getAuthErrorMessage(err.code))
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

          {/* <div className="login-visual-bottom">
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
          </div> */}
          <div className="login-visual-bottom">
  <img
    src={loginSlides[activeSlide].image}
    alt={loginSlides[activeSlide].title}
    className="slide-image"
  />

  <h2>{loginSlides[activeSlide].title}</h2>

  <p className="slide-description">
    {loginSlides[activeSlide].description}
  </p>

  <div className="login-dots">
    {loginSlides.map((slide, index) => (
      <span
        key={slide.id}
        className={index === activeSlide ? 'active' : ''}
      />
    ))}
  </div>
</div>
        </aside>

        <form className="login-form" onSubmit={handleSubmit}>
          <h1>
            {isSignup
              ? 'Create Your Vault'
              : 'Access Your Vault'}
          </h1>

          <p className="login-form-sub">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setIsSignup(false)
                    setError('')
                  }}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setIsSignup(true)
                    setError('')
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </p>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}
{success && (
  <p className="login-success">
    {success}
  </p>
)}
          <div className="login-field">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field login-field-password">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              disabled={loading}
            />

            <button
              type="button"
              className="login-eye"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>
  <div className="forgot-password">
    <button
      type="button"
      className="link-btn"
      onClick={handleForgotPassword}
      disabled={loading}
    >
      Forgot Password?
    </button>
  </div>
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? isSignup
                ? 'Creating Account...'
                : 'Signing In...'
              : isSignup
              ? 'Create Account'
              : 'Log In'}
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