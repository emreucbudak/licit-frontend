import { useEffect, useRef, useState } from 'react'

const CODE_LENGTH = 6
const RESEND_TIMEOUT = 45

function createEmptyCode() {
  return Array.from({ length: CODE_LENGTH }, () => '')
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function VerifyIdentityPage({ navigate, onPasswordResetVerified }) {
  const [code, setCode] = useState(createEmptyCode)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT)
  const inputRefs = useRef([])

  useEffect(() => {
    if (secondsLeft === 0) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [secondsLeft])

  const isComplete = code.every((digit) => digit !== '')

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  const updateDigit = (index, rawValue) => {
    const nextValue = rawValue.replace(/\D/g, '').slice(-1)

    setCode((current) => {
      const nextCode = [...current]
      nextCode[index] = nextValue
      return nextCode
    })

    if (nextValue && index < CODE_LENGTH - 1) {
      window.setTimeout(() => focusInput(index + 1), 0)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && code[index] === '' && index > 0) {
      focusInput(index - 1)
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event) => {
    const pastedDigits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, CODE_LENGTH)
      .split('')

    if (pastedDigits.length === 0) {
      return
    }

    event.preventDefault()

    setCode((current) => {
      const nextCode = [...current]

      pastedDigits.forEach((digit, index) => {
        nextCode[index] = digit
      })

      return nextCode
    })

    const nextIndex = Math.min(pastedDigits.length, CODE_LENGTH - 1)
    window.setTimeout(() => focusInput(nextIndex), 0)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isComplete) {
      return
    }

    onPasswordResetVerified?.()
  }

  const handleResend = () => {
    setCode(createEmptyCode())
    setSecondsLeft(RESEND_TIMEOUT)
    focusInput(0)
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
                lock_open
              </span>
            </div>

            <h1 className="mb-3 font-headline text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
              Kimliğini Doğrula
            </h1>
            <p className="mx-auto max-w-sm font-body text-sm leading-relaxed text-on-surface-variant sm:text-base">
              E-posta adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen
              aşağıya gir.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="mx-auto flex w-full max-w-[28rem] items-center justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <div key={`otp-slot-${index + 1}`} className="contents">
                  {index === 3 ? (
                    <div className="mx-1 h-0.5 w-3 shrink-0 rounded-full bg-outline-variant/30" />
                  ) : null}
                  <input
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    aria-label={`Kod hanesi ${index + 1}`}
                    className="h-14 min-w-0 flex-1 rounded border border-outline-variant/20 bg-surface-container-lowest text-center font-display text-xl font-bold text-on-surface transition-colors placeholder:text-on-surface-variant focus:border-primary/40 focus:bg-surface-container-highest focus:outline-none sm:h-16 sm:text-2xl"
                    inputMode="numeric"
                    maxLength={1}
                    placeholder="•"
                    type="text"
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                  />
                </div>
              ))}
            </div>

            <button
              className="flex w-full items-center justify-center rounded bg-gradient-to-r from-primary to-primary-container px-6 py-4 text-base font-bold tracking-wide text-background transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!isComplete}
            >
              Doğrula ve Devam Et
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center justify-center space-y-2 text-center">
            <p className="font-body text-sm text-on-surface-variant">
              Kodu almadın mı?
            </p>
            <div className="flex items-center space-x-2">
              <button
                className="text-sm font-semibold text-primary transition-colors hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={secondsLeft > 0}
                onClick={handleResend}
              >
                Kodu Tekrar Gönder
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

export default VerifyIdentityPage
