import { useState } from 'react'

function LoginForm({ navigate, onLogin }) {
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
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="email"
          >
            E-posta veya kullanıcı adı
          </label>
          <input
            className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
            id="email"
            name="email"
            placeholder="emreucbudak"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <label
              className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              htmlFor="password"
            >
              Şifre
            </label>
            <a
              className="text-xs font-semibold text-primary transition-colors hover:text-primary-container"
              href="/forgot-password"
              onClick={navigate('/forgot-password')}
            >
              Şifreni mi unuttun?
            </a>
          </div>

          <div className="relative">
            <input
              className="w-full rounded bg-surface-container-lowest px-4 py-3.5 pr-12 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
              id="password"
              name="password"
              placeholder="********"
              required
              type={showPassword ? 'text' : 'password'}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-outline-variant transition-colors hover:text-on-surface"
              type="button"
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              onClick={() => setShowPassword((current) => !current)}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          className="mt-8 w-full rounded bg-gradient-to-r from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-[0_4px_30px_-10px_rgba(192,193,255,0.4)] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          type="submit"
        >
          Giriş yap
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-body text-sm text-on-surface-variant">
          Hesabın yok mu?{' '}
          <a
            className="font-semibold text-primary transition-colors hover:text-primary-container"
            href="/register"
            onClick={navigate('/register')}
          >
            Kaydol
          </a>
        </p>
      </div>
    </>
  )
}

export default LoginForm
