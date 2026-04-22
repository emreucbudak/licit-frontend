import { useState } from 'react'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BWO74reHWJKrfOvYYUPRVmmnkf0G9AynNsGy5ZnijneBp8AayHwwzxdTIJnsUsuyvVlNw3xQcrKukuy3SscyFybTpZ8J4JYq_f4FjxVvGVOzE256ddasMgetjqXWCGu9PtsED_7SuaeUL3zKJWl9awLQVsWNpRNLrckfrsM1iCIzPEp0l-1WHJOL82wOzPA63C-I7T3oKnldx52vGHFrWE0Ruyxfj2AEMAWCbzbVSdC-enjegyh0nCCwVjilMcBKxRNJo42uEyM'

function RegisterPage({ navigate }) {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="flex min-h-screen w-full bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface-container-lowest p-12 lg:flex">
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/20"></div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/2 rounded-full bg-primary/10 blur-[120px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10">
          <a
            className="font-display text-3xl font-black uppercase tracking-tighter text-primary"
            href="/"
            onClick={navigate('/')}
          >
            Licit
          </a>
        </div>

        <div className="relative z-10 mb-28 max-w-lg -ml-1">
          <h1 className="mb-4 font-headline text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
            Dijital Koleksiyoner Alanı.
          </h1>
          <p className="font-body text-xl font-medium tracking-wide text-on-surface-variant">
            Yüksek hızlı müzayede platformuna katıl.
          </p>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center overflow-hidden bg-surface-container-low p-6 sm:p-12 lg:w-1/2 lg:p-24">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-container/5 blur-[100px] lg:hidden"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <a
              className="font-display text-2xl font-black uppercase tracking-tighter text-primary"
              href="/"
              onClick={navigate('/')}
            >
              Licit
            </a>
          </div>

          <div className="mb-10">
            <h2 className="mb-2 font-headline text-3xl font-bold tracking-tight text-on-surface">
              Hesap oluştur
            </h2>
            <p className="font-body text-on-surface-variant">
              Platforma kaydolmak için bilgilerini gir.
            </p>
          </div>

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
                placeholder="Emre Budak"
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
                  placeholder="emrebudak"
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
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
