import { useEffect, useRef } from 'react'
import { createEmptyOtpCode } from '../utils/otpCode'

const DEFAULT_CODE_LENGTH = 6

function OtpCodeInput({
  length = DEFAULT_CODE_LENGTH,
  resetFocusSignal = 0,
  value,
  onChange,
}) {
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
    inputRefs.current[0]?.select()
  }, [resetFocusSignal])

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  const updateDigit = (index, rawValue) => {
    const nextValue = rawValue.replace(/\D/g, '').slice(-1)
    const nextCode = [...value]
    nextCode[index] = nextValue
    onChange(nextCode)

    if (nextValue && index < length - 1) {
      window.setTimeout(() => focusInput(index + 1), 0)
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && value[index] === '' && index > 0) {
      focusInput(index - 1)
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusInput(index - 1)
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      event.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (event) => {
    const pastedDigits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length)
      .split('')

    if (pastedDigits.length === 0) {
      return
    }

    event.preventDefault()

    const nextCode = createEmptyOtpCode(length)
    pastedDigits.forEach((digit, index) => {
      nextCode[index] = digit
    })

    onChange(nextCode)

    const nextIndex = Math.min(pastedDigits.length, length - 1)
    window.setTimeout(() => focusInput(nextIndex), 0)
  }

  return (
    <div className="mx-auto flex w-full max-w-[28rem] items-center justify-center gap-2 sm:gap-3">
      {value.map((digit, index) => (
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
            placeholder="*"
            type="text"
            value={digit}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
          />
        </div>
      ))}
    </div>
  )
}

export default OtpCodeInput
