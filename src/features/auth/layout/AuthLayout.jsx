const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD7BWO74reHWJKrfOvYYUPRVmmnkf0G9AynNsGy5ZnijneBp8AayHwwzxdTIJnsUsuyvVlNw3xQcrKukuy3SscyFybTpZ8J4JYq_f4FjxVvGVOzE256ddasMgetjqXWCGu9PtsED_7SuaeUL3zKJWl9awLQVsWNpRNLrckfrsM1iCIzPEp0l-1WHJOL82wOzPA63C-I7T3oKnldx52vGHFrWE0Ruyxfj2AEMAWCbzbVSdC-enjegyh0nCCwVjilMcBKxRNJo42uEyM'

function AuthLayout({ children, mode = 'login', navigate }) {
  const showHeroCopy = mode === 'register'
  const formAlignmentClass =
    mode === 'login'
      ? 'items-start p-6 pt-40 sm:items-center sm:p-12 sm:pt-40 lg:p-24 lg:pt-56'
      : 'items-start p-6 pt-4 pb-6 sm:p-12 sm:pt-16 sm:pb-6 lg:px-24 lg:pt-12 lg:pb-8'

  return (
    <main
      className="flex min-h-screen w-full bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container"
    >
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

        {showHeroCopy ? (
          <div className="relative z-10 -mt-[300px] max-w-lg -ml-1">
            <h1 className="mb-4 font-headline text-5xl font-extrabold leading-tight tracking-tight text-on-surface">
              Yeni nesil ihale deneyimi
            </h1>
            <p className="font-body text-xl font-medium tracking-wide text-on-surface-variant">
              Yüksek hızlı ihale deneyimine katıl.
            </p>
          </div>
        ) : null}
      </section>

      <section
        className={`relative flex w-full justify-center overflow-hidden bg-surface-container-low lg:w-1/2 ${formAlignmentClass}`}
      >
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-container/5 blur-[100px] lg:hidden"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 sm:mb-12 lg:hidden">
            <a
              className="font-display text-2xl font-black uppercase tracking-tighter text-primary"
              href="/"
              onClick={navigate('/')}
            >
              Licit
            </a>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
