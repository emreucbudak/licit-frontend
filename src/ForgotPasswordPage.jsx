import { useState } from 'react'

function ForgotPasswordPage({ navigate, onPasswordResetRequested }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      return
    }

    onPasswordResetRequested?.(trimmedEmail)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <a
            className="text-3xl font-black tracking-tighter text-primary"
            href="/"
            onClick={navigate('/')}
          >
            LICIT
          </a>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-variant/60 p-8 shadow-[0_40px_60px_-15px_rgba(45,52,73,0.12)] backdrop-blur-xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-primary-container" />

          <div className="mb-8 text-center">
            <h1 className="mb-3 font-headline text-2xl font-bold tracking-tight text-on-surface">
              Şifreni Sıfırla
            </h1>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant">
              Şifreni sıfırlamak için e-posta adresini gir.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-label text-xs font-medium uppercase tracking-wider text-on-surface-variant"
                htmlFor="forgot-email"
              >
                E-posta Adresi
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-xl text-on-surface-variant/70">
                    mail
                  </span>
                </div>

                <input
                  className="block w-full rounded border border-outline-variant/20 bg-surface-container-lowest py-3.5 pl-11 pr-4 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:bg-surface-container-highest focus:outline-none"
                  id="forgot-email"
                  name="email"
                  placeholder="ornek@licit.com"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <button
              className="flex w-full justify-center rounded bg-gradient-to-r from-primary to-primary-container px-4 py-3.5 font-label font-bold tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              type="submit"
            >
              Kodu Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
