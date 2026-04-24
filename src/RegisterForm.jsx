import { useState } from 'react'

function RegisterForm({ navigate, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin?.()
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="fullName"
          >
            Ad Soyad
          </label>
          <input
            className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
            id="fullName"
            name="fullName"
            placeholder="Emre Üçbudak"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="username"
          >
            Kullanıcı Adı
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-medium text-outline-variant">
              @
            </span>
            <input
              className="w-full rounded bg-surface-container-lowest py-3.5 pl-9 pr-4 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
              id="username"
              name="username"
              placeholder="emreucbudak"
              required
              type="text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="registerEmail"
          >
            E-posta
          </label>
          <input
            className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
            id="registerEmail"
            name="email"
            placeholder="emre@example.com"
            required
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="registerPassword"
          >
            Şifre
          </label>
          <div className="relative">
            <input
              className="w-full rounded bg-surface-container-lowest px-4 py-3.5 pr-12 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
              id="registerPassword"
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
          Kaydol
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-body text-sm text-on-surface-variant">
          Zaten hesabın var mı?{' '}
          <a
            className="font-semibold text-primary transition-colors hover:text-primary-container"
            href="/login"
            onClick={navigate('/login')}
          >
            Giriş yap
          </a>
        </p>
      </div>
    </>
  )
}

export default RegisterForm
