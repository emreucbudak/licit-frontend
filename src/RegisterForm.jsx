import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import PasswordStrengthPanel from './components/PasswordStrengthPanel'
import { registerSchema } from './utils/authSchemas'

function RegisterForm({ navigate, onLogin, onRegisterRequested }) {
  const [showPassword, setShowPassword] = useState(false)
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = ({ email }) => {
    const cleanEmail = String(email || '').trim()

    if (onRegisterRequested) {
      onRegisterRequested(cleanEmail)
      return
    }

    onLogin?.()
  }

  return (
    <>
      <form className="space-y-6 lg:space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="Emre Üçbudak"
            required
            type="text"
            {...register('fullName')}
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
              placeholder="emreucbudak"
              required
              type="text"
              autoComplete="username"
              {...register('username')}
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
            placeholder="emre@example.com"
            required
            type="email"
            autoComplete="email"
            {...register('email')}
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
              placeholder="********"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
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

        <PasswordStrengthPanel
          className="-mt-2"
          control={control}
          hideEmptyLabel
          hideHelperText
          hideStrengthLabel
          hideTitle
          name="password"
          spacingClass="space-y-3"
        />

        <button
          className="mt-4 w-full rounded bg-gradient-to-r from-primary to-primary-container py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-[0_4px_30px_-10px_rgba(192,193,255,0.4)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] lg:mt-1"
          type="submit"
        >
          Kaydol
        </button>
      </form>

      <div className="mt-2 text-center">
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
