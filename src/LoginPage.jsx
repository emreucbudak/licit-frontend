import { useState } from 'react'
import './LoginPage.css'

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="login-social-button__icon" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="login-social-button__icon"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.97 3.63 2.15-3.06 1.74-2.46 5.86.6 7.11-.7 1.63-1.48 3.1-2.88 4.75zM12.03 7.25C11.96 3.73 14.96 1 18.06 1c.28 3.6-3.23 6.46-6.03 6.25z" />
    </svg>
  )
}

function LoginPage({ navigate }) {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="login-page">
      <main className="login-shell">
        <div className="login-brand-block">
          <a className="login-brand" href="/" onClick={navigate('/')}>
            Licit
          </a>
          <p>High-Velocity Exchange</p>
        </div>

        <section className="login-panel" aria-labelledby="login-title">
          <h1 id="login-title">Sign In</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Email or Username
              </label>
              <div className="login-input-shell">
                <span className="material-symbols-outlined login-input-shell__icon">
                  person
                </span>
                <input
                  className="login-input"
                  id="email"
                  name="email"
                  placeholder="Enter your credentials"
                  type="text"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <a className="login-text-link" href="#forgot-password">
                  Forgot Password?
                </a>
              </div>

              <div className="login-input-shell">
                <span className="material-symbols-outlined login-input-shell__icon">
                  lock
                </span>
                <input
                  className="login-input login-input--password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="login-password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <label className="login-remember" htmlFor="remember">
              <input id="remember" type="checkbox" />
              <span>Remember me for 30 days</span>
            </label>

            <button className="login-submit" type="submit">
              Access Terminal
            </button>
          </form>

          <div className="login-divider">
            <span>Or continue with</span>
          </div>

          <div className="login-social-grid">
            <button className="login-social-button" type="button">
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button className="login-social-button" type="button">
              <AppleIcon />
              <span>Apple</span>
            </button>
          </div>

          <p className="login-request">
            Don't have an account?{' '}
            <a href="#request-access">Request Access</a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
