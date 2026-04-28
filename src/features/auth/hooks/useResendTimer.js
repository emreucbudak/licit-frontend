import { useEffect, useState } from 'react'

function useResendTimer(initialSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

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

  const resetTimer = () => {
    setSecondsLeft(initialSeconds)
  }

  return {
    canResend: secondsLeft === 0,
    resetTimer,
    secondsLeft,
  }
}

export default useResendTimer
