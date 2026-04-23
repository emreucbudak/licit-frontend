import { useState } from 'react'

function getPasswordChecks(password) {
  return [
    {
      id: 'length',
      label: 'En az 8 karakter',
      met: password.length >= 8,
    },
    {
      id: 'number',
      label: 'En az 1 rakam',
      met: /\d/.test(password),
    },
    {
      id: 'symbol',
      label: 'En az 1 sembol',
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: 'case',
      label: 'Büyük ve küçük harf',
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
  ]
}

function getStrengthMeta(score) {
  if (score <= 1) {
    return {
      label: 'Zayıf',
      textClass: 'text-error',
      barClass: 'bg-error',
    }
  }

  if (score === 2) {
    return {
      label: 'Orta',
      textClass: 'text-tertiary',
      barClass: 'bg-tertiary',
    }
  }

  if (score === 3) {
    return {
      label: 'İyi',
      textClass: 'text-primary',
      barClass: 'bg-primary',
    }
  }

  return {
    label: 'Güçlü',
    textClass: 'text-secondary',
    barClass: 'bg-secondary',
  }
}

function CreateNewPasswordPage({ navigate }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const checks = getPasswordChecks(password)
  const strengthScore = checks.filter((check) => check.met).length
  const strength = getStrengthMeta(strengthScore)
  const meetsMinimumRules =
    checks.find((check) => check.id === 'length')?.met &&
    checks.find((check) => check.id === 'number')?.met &&
    checks.find((check) => check.id === 'symbol')?.met

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword

  const canSubmit =
    Boolean(meetsMinimumRules) && passwordsMatch && password.length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #2d3449 0%, transparent 40%), radial-gradient(circle at 20% 80%, #171f33 0%, transparent 40%)',
        }}
      />

      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-b from-slate-900/50 to-transparent px-6 backdrop-blur-xl">
        <a
          className="mx-auto text-xl font-black tracking-tighter text-indigo-400"
          href="/"
          onClick={navigate('/')}
        >
          LICIT
        </a>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <div className="mt-4 rounded-xl border border-outline-variant/20 bg-surface-container-high/60 p-8 shadow-[0_40px_60px_-15px_rgba(45,52,73,0.12)] backdrop-blur-xl">
            <div className="mb-10 text-center">
              <h1 className="mb-3 font-headline text-3xl font-bold tracking-tight text-on-surface">
                Yeni Şifre Oluştur
              </h1>
              <p className="mx-auto max-w-[280px] font-body text-sm leading-relaxed text-on-surface-variant">
                Yeni şifren daha önce kullandığın şifrelerden farklı olmalı.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                  htmlFor="new_password"
                >
                  Yeni Şifre
                </label>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    key
                  </span>
                  <input
                    className="w-full rounded border border-outline-variant/20 bg-surface-container-lowest py-3.5 pl-12 pr-12 font-body text-base text-on-surface outline-none transition-colors placeholder:text-outline/50 focus:border-primary/50 focus:bg-surface-container-highest"
                    id="new_password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-outline transition-colors hover:text-on-surface"
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

              <div className="space-y-2 pt-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-label text-xs font-medium text-on-surface-variant">
                    Şifre Gücü
                  </span>
                  <span
                    className={`font-label text-xs font-medium ${strength.textClass}`}
                  >
                    {password.length === 0 ? 'Hazır değil' : strength.label}
                  </span>
                </div>

                <div className="flex h-1.5 gap-1.5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={`strength-bar-${index + 1}`}
                      className={`h-full flex-1 rounded-full ${
                        index < strengthScore
                          ? strength.barClass
                          : 'bg-surface-container-low'
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-2 font-label text-xs text-on-surface-variant/70">
                  En az 8 karakter, bir rakam ve bir sembol içermeli.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label
                  className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                  htmlFor="confirm_password"
                >
                  Yeni Şifreyi Onayla
                </label>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                    lock
                  </span>
                  <input
                    className="w-full rounded border border-outline-variant/20 bg-surface-container-lowest py-3.5 pl-12 pr-12 font-body text-base text-on-surface outline-none transition-colors placeholder:text-outline/50 focus:border-primary/50 focus:bg-surface-container-highest"
                    id="confirm_password"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-outline transition-colors hover:text-on-surface"
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? 'Onay şifresini gizle'
                        : 'Onay şifresini göster'
                    }
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>

                {confirmPassword.length > 0 ? (
                  <p
                    className={`font-label text-xs ${
                      passwordsMatch ? 'text-secondary' : 'text-error'
                    }`}
                    aria-live="polite"
                  >
                    {passwordsMatch
                      ? 'Şifreler eşleşiyor.'
                      : 'Şifreler birbiriyle uyuşmuyor.'}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2 rounded-lg border border-outline-variant/15 bg-surface-container-lowest/70 p-4">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-center gap-2 text-xs text-on-surface-variant"
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${
                        check.met ? 'text-secondary' : 'text-outline'
                      }`}
                    >
                      {check.met ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{check.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-primary to-primary-container px-6 py-4 font-headline text-base font-bold text-on-primary shadow-[0_0_20px_-5px_rgba(192,193,255,0.4)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_25px_-5px_rgba(192,193,255,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100 disabled:hover:shadow-[0_0_20px_-5px_rgba(192,193,255,0.4)]"
                  type="submit"
                  disabled={!canSubmit}
                >
                  Şifreyi Güncelle
                  <span className="material-symbols-outlined text-xl">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateNewPasswordPage
