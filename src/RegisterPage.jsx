import { useState } from 'react'

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BWO74reHWJKrfOvYYUPRVmmnkf0G9AynNsGy5ZnijneBp8AayHwwzxdTIJnsUsuyvVlNw3xQcrKukuy3SscyFybTpZ8J4JYq_f4FjxVvGVOzE256ddasMgetjqXWCGu9PtsED_7SuaeUL3zKJWl9awLQVsWNpRNLrckfrsM1iCIzPEp0l-1WHJOL82wOzPA63C-I7T3oKnldx52vGHFrWE0Ruyxfj2AEMAWCbzbVSdC-enjegyh0nCCwVjilMcBKxRNJo42uEyM'

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-on-surface transition-colors group-hover:text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-on-surface transition-colors group-hover:text-primary"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M16.365 14.004c-.035-2.584 2.115-3.834 2.215-3.895-1.2-1.758-3.07-1.996-3.743-2.023-1.583-.16-3.09.932-3.896.932-.807 0-2.062-.912-3.376-.887-1.706.024-3.277.994-4.156 2.528-1.782 3.09-.456 7.662 1.286 10.18.85 1.226 1.854 2.6 3.167 2.548 1.264-.05 1.748-.82 3.277-.82 1.53 0 1.964.82 3.278.795 1.365-.024 2.214-1.225 3.062-2.47 1.008-1.465 1.423-2.887 1.442-2.962-.03-.013-2.775-1.066-2.556-3.926zm-2.036-6.173c.706-.856 1.182-2.046 1.053-3.234-1.018.04-2.257.677-2.986 1.533-.58.68-1.154 1.89-1.002 3.056 1.144.088 2.23-.585 2.935-1.355z" />
    </svg>
  )
}

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

        <div className="relative z-10 mb-12 max-w-lg">
          <h1 className="mb-4 font-headline text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
            The Digital Curator.
          </h1>
          <p className="font-body text-xl font-medium tracking-wide text-on-surface-variant">
            Join the high-velocity exchange.
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
              Create an account
            </h2>
            <p className="font-body text-on-surface-variant">
              Enter your details to register for the platform.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                type="text"
              />
            </div>

            <div className="space-y-2">
              <label
                className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-medium text-outline-variant">
                  @
                </span>
                <input
                  className="w-full rounded bg-surface-container-lowest py-3.5 pl-9 pr-4 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
                  id="username"
                  name="username"
                  placeholder="johndoe"
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
                Email
              </label>
              <input
                className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
                id="registerEmail"
                name="email"
                placeholder="john@example.com"
                required
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label
                className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                htmlFor="registerPassword"
              >
                Password
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              Join Platform
            </button>
          </form>

          <div className="mb-8 mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-surface-container-highest"></div>
            <span className="font-label text-xs uppercase tracking-widest text-outline-variant">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-surface-container-highest"></div>
          </div>

          <div className="flex gap-4">
            <button
              className="group flex flex-1 items-center justify-center gap-2 rounded bg-surface py-3.5 ring-1 ring-outline-variant/20 transition-colors hover:bg-surface-container-high"
              type="button"
            >
              <GoogleIcon />
              <span className="font-label text-sm font-semibold">Google</span>
            </button>
            <button
              className="group flex flex-1 items-center justify-center gap-2 rounded bg-surface py-3.5 ring-1 ring-outline-variant/20 transition-colors hover:bg-surface-container-high"
              type="button"
            >
              <AppleIcon />
              <span className="font-label text-sm font-semibold">Apple</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Already have an account?{' '}
              <a
                className="font-semibold text-primary transition-colors hover:text-primary-container"
                href="/login"
                onClick={navigate('/login')}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
