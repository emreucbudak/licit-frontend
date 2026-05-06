import { useState } from 'react'
import OtpCodeInput from '../components/OtpCodeInput'
import useResendTimer from '../hooks/useResendTimer'
import { createEmptyOtpCode } from '../utils/otpCode'
import { getUserFacingErrorMessage } from '../../../shared/api/apiError'

const CODE_LENGTH = 6
const RESEND_TIMEOUT = 45

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function OtpVerificationPage({
  description,
  icon = 'lock_open',
  navigate,
  onResend,
  onVerified,
  resendLabel = 'Kodu Tekrar Gönder',
  resendPrompt = 'Kodu almadın mı?',
  submitLabel = 'Doğrula ve Devam Et',
  title,
}) {
  const [code, setCode] = useState(() => createEmptyOtpCode(CODE_LENGTH))
  const [resetFocusSignal, setResetFocusSignal] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { canResend, resetTimer, secondsLeft } = useResendTimer(RESEND_TIMEOUT)
  const isComplete = code.every((digit) => digit !== '')

  const handleCodeChange = (nextCode) => {
    setCode(nextCode)
    setSubmitError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isComplete || isSubmitting) {
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    try {
      await onVerified?.(code.join(''))
    } catch (error) {
      setSubmitError(
        getUserFacingErrorMessage(error, 'Kod doğrulanamadı. Lütfen tekrar dene.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) {
      return
    }

    setSubmitError('')
    setIsResending(true)

    try {
      await onResend?.()
      setCode(createEmptyOtpCode(CODE_LENGTH))
      setResetFocusSignal((current) => current + 1)
      resetTimer()
    } catch (error) {
      setSubmitError(
        getUserFacingErrorMessage(
          error,
          'Kod tekrar gönderilemedi. Lütfen tekrar dene.',
        ),
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background antialiased">
      <header className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-b from-slate-900/50 to-transparent px-6 backdrop-blur-xl">
        <a
          className="mx-auto text-xl font-black tracking-tight text-indigo-400"
          href="/"
          onClick={navigate('/')}
        >
          LICIT
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-high p-6 shadow-[0_20px_60px_rgba(45,52,73,0.12)] sm:p-10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-primary-container" />

          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-lowest">
              <span className="material-symbols-outlined text-2xl text-primary">
                {icon}
              </span>
            </div>

            <h1 className="mb-3 font-headline text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
              {title}
            </h1>
            <p className="mx-auto max-w-sm font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
              {description}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <OtpCodeInput
              resetFocusSignal={resetFocusSignal}
              value={code}
              onChange={handleCodeChange}
            />

            {submitError ? (
              <p
                className="rounded border border-error/20 bg-error/10 px-4 py-3 text-sm font-medium text-error"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}

            <button
              className="flex w-full items-center justify-center rounded bg-gradient-to-r from-primary to-primary-container px-6 py-4 text-base font-bold tracking-wide text-background transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? 'Doğrulanıyor' : submitLabel}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center justify-center space-y-2 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              {resendPrompt}
            </p>
            <div className="flex items-center space-x-2">
              <button
                className="text-sm font-semibold text-primary transition-colors hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={!canResend || isResending}
                onClick={handleResend}
              >
                {isResending ? 'Gönderiliyor' : resendLabel}
              </button>
              <span className="rounded border border-outline-variant/20 bg-surface-container px-2 py-0.5 font-mono text-sm tracking-tight text-on-surface-variant">
                {formatTime(secondsLeft)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OtpVerificationPage
