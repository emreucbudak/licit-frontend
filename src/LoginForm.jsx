import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { buildApiUrl } from './config/runtimeConfig'

async function readLoginError(response) {
  const fallbackMessage = 'Giris tamamlanamadi. Lutfen tekrar dene.'

  try {
    const payload = await response.json()
    const validationMessage = payload?.errors
      ?.map((error) => error.errorMessage || error.message)
      .filter(Boolean)
      .join(' ')

    return validationMessage || payload?.message || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

function LoginForm({ navigate, onLoginChallengeRequested }) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async ({ email, password }) => {
    setSubmitError('')

    const cleanEmail = String(email || '').trim()
    const cleanPassword = String(password || '').trim()

    if (!cleanEmail || !cleanPassword) {
      return
    }

    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      })

      if (!response.ok) {
        setSubmitError(await readLoginError(response))
        return
      }

      const result = await response.json()
      onLoginChallengeRequested?.({
        email: cleanEmail,
        temporaryToken: result?.temporaryToken || '',
        expiresAt: result?.expiresAt || '',
      })
    } catch {
      setSubmitError('Giris tamamlanamadi. Baglantiyi kontrol edip tekrar dene.')
    }
  }

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label
            className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
            htmlFor="email"
          >
            E-posta
          </label>
          <input
            className="w-full rounded bg-surface-container-lowest px-4 py-3.5 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
            id="email"
            placeholder="emre@example.com"
            required
            type="email"
            autoComplete="email"
            {...register('email', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <label
              className="block font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              htmlFor="password"
            >
              Sifre
            </label>
            <a
              className="text-xs font-semibold text-primary transition-colors hover:text-primary-container"
              href="/forgot-password"
              onClick={navigate('/forgot-password')}
            >
              Sifreni mi unuttun?
            </a>
          </div>

          <div className="relative">
            <input
              className="w-full rounded bg-surface-container-lowest px-4 py-3.5 pr-12 text-on-surface ring-1 ring-transparent transition-all duration-200 placeholder:text-outline-variant/50 focus:bg-surface-container-highest focus:outline-none focus:ring-outline-variant/30"
              id="password"
              placeholder="********"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password', { required: true })}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-outline-variant transition-colors hover:text-on-surface"
              type="button"
              aria-label={showPassword ? 'Sifreyi gizle' : 'Sifreyi goster'}
              onClick={() => setShowPassword((current) => !current)}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {submitError ? (
          <p className="rounded border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error" role="alert">
            {submitError}
          </p>
        ) : null}

        <button
          className="mt-8 w-full rounded bg-gradient-to-r from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-[0_4px_30px_-10px_rgba(192,193,255,0.4)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Kod gonderiliyor' : 'Giris yap'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="font-body text-sm text-on-surface-variant">
          Hesabin yok mu?{' '}
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
