import { useState } from 'react'
import './LoginPage.css'

function LoginPage({ navigate, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const identifier = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '').trim()

    if (!identifier || !password) {
      return
    }

    onLogin?.()
  }

  return (
    <div className="login-page">
      <main className="login-shell">
        <div className="login-brand-block">
          <a className="login-brand" href="/" onClick={navigate('/')}>
            Licit
          </a>
        </div>

        <section className="login-panel" aria-labelledby="login-title">
          <h1 id="login-title">Giriş Yap</h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                E-posta veya Kullanıcı Adı
              </label>
              <div className="login-input-shell">
                <span className="material-symbols-outlined login-input-shell__icon">
                  person
                </span>
                <input
                  className="login-input"
                  id="email"
                  name="email"
                  placeholder="Bilgilerini gir"
                  required
                  type="text"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="password">
                  Şifre
                </label>
                <a
                  className="login-text-link"
                  href="/forgot-password"
                  onClick={navigate('/forgot-password')}
                >
                  Şifreni mi unuttun?
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
                  placeholder="********"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="login-password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <button className="login-submit" type="submit">
              Giriş Yap
            </button>
          </form>

          <p className="login-request">
            Hesabın yok mu?{' '}
            <a href="/register" onClick={navigate('/register')}>
              Kaydol
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
