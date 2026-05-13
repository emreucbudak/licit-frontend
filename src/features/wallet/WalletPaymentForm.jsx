import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

function createIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const randomValue = Math.floor(Math.random() * 16)
    const value = token === 'x' ? randomValue : (randomValue & 0x3) | 0x8
    return value.toString(16)
  })
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const paymentSyncDelayMs = 1500
const paymentSyncMaxAttempts = 40

function WalletPaymentForm({
  amount,
  amountMinor,
  isAmountValid,
  maximumAmount,
  minimumAmount,
  onPaymentStarted,
  onPaymentSucceeded,
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState('')
  const [paymentMessage, setPaymentMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!elements || !amountMinor) {
      return
    }

    const updateResult = elements.update({ amount: amountMinor })

    if (typeof updateResult?.catch === 'function') {
      updateResult.catch(() => {})
    }
  }, [amountMinor, elements])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setPaymentError('')
    setPaymentMessage('')
    onPaymentStarted?.()
    setIsSubmitting(true)

    try {
      if (!isAmountValid) {
        throw new Error(
          `Yükleme tutarı ${minimumAmount} - ${maximumAmount} TL arasında olmalı.`,
        )
      }

      const { error: submitError } = await elements.submit()

      if (submitError) {
        throw new Error(submitError.message || 'Kart bilgilerini kontrol et.')
      }

      const paymentIntentResult = await sendAuthorizedRequest(
        '/api/wallet/deposits/payment-intents',
        {
          body: { amount },
          headers: { 'Idempotency-Key': createIdempotencyKey() },
          method: 'POST',
        },
      )

      if (!paymentIntentResult.response.ok) {
        throw new Error(
          getApiErrorMessage(
            paymentIntentResult.payload,
            'Ödeme başlatılamadı.',
          ),
        )
      }

      if (!paymentIntentResult.payload?.clientSecret) {
        throw new Error('Ödeme başlatılamadı.')
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret: paymentIntentResult.payload.clientSecret,
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/wallet/top-up`,
        },
        redirect: 'if_required',
      })

      if (error) {
        throw new Error(error.message || 'Ödeme tamamlanamadı.')
      }

      if (!paymentIntent?.id) {
        throw new Error('Ödeme sonucu alınamadı.')
      }

      let syncResult = null

      for (let attempt = 1; attempt <= paymentSyncMaxAttempts; attempt += 1) {
        syncResult = await sendAuthorizedRequest(
          `/api/wallet/deposits/payment-intents/${encodeURIComponent(paymentIntent.id)}/sync`,
          { method: 'POST' },
        )

        if (!syncResult.response.ok) {
          throw new Error(
            getApiErrorMessage(syncResult.payload, 'Ödeme onayı alınamadı.'),
          )
        }

        if (syncResult.payload?.applied) {
          break
        }

        const status = String(syncResult.payload?.status || '').toLowerCase()

        if (
          status === 'canceled' ||
          status === 'requires_payment_method' ||
          status === 'requires_confirmation'
        ) {
          throw new Error('Ödeme tamamlanamadı.')
        }

        setPaymentMessage('Ödeme doğrulanıyor, lütfen bekle.')
        await wait(paymentSyncDelayMs)
      }

      if (!syncResult?.payload?.applied) {
        throw new Error('Ödeme doğrulaması zaman aşımına uğradı.')
      }

      setPaymentMessage('')
      onPaymentSucceeded?.(syncResult.payload)
    } catch (error) {
      setPaymentError(
        getUserFacingErrorMessage(error, 'Ödeme tamamlanamadı.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="flex h-full min-w-0 flex-col space-y-5 overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div className="min-w-0 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface p-4">
        <PaymentElement />
      </div>

      {paymentError ? (
        <p className="min-w-0 break-words text-sm text-error [overflow-wrap:anywhere]">
          {paymentError}
        </p>
      ) : null}
      {paymentMessage ? (
        <p className="min-w-0 break-words text-sm text-secondary [overflow-wrap:anywhere]">
          {paymentMessage}
        </p>
      ) : null}

      <button
        className="mt-auto flex min-w-0 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        disabled={!stripe || !elements || isSubmitting || !isAmountValid}
        type="submit"
      >
        <span className="material-symbols-outlined shrink-0 text-[18px]">
          credit_card
        </span>
        <span className="min-w-0 truncate whitespace-nowrap">
          {isSubmitting ? 'İşleniyor...' : 'Ödeme yap'}
        </span>
      </button>
    </form>
  )
}

export default WalletPaymentForm
