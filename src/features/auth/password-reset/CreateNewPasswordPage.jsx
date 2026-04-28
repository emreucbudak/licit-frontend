import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import {
  PasswordRuleChecklist,
  PasswordStrengthBars,
} from '../components/PasswordStrengthPanel'
import {
  getPasswordChecks,
  passwordMeetsMinimumRules,
} from '../utils/passwordRules'
import { createNewPasswordSchema } from '../utils/authSchemas'

function CreateNewPasswordPage({ navigate, onPasswordResetCompleted }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(createNewPasswordSchema),
  })
  const password = useWatch({ control, name: 'password' }) || ''
  const confirmPassword = useWatch({ control, name: 'confirmPassword' }) || ''

  const checks = getPasswordChecks(password)
  const meetsMinimumRules = passwordMeetsMinimumRules(password)

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword

  const canSubmit =
    Boolean(meetsMinimumRules) && passwordsMatch && password.length > 0

  const onSubmit = () => {
    onPasswordResetCompleted?.()
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

            <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                    autoComplete="new-password"
                    {...register('password')}
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

              <PasswordStrengthBars password={password} />

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
                    autoComplete="new-password"
                    {...register('confirmPassword')}
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

              <PasswordRuleChecklist checks={checks} />

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
