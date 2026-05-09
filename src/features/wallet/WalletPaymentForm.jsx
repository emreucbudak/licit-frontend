import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

function WalletPaymentForm({ onPaymentSucceeded }) {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState('')
  const [paymentMessage, setPaymentMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setPaymentError('')
    setPaymentMessage('')
    setIsSubmitting(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        throw new Error(error.message || 'Ödeme tamamlanamadı.')
      }

      if (!paymentIntent?.id) {
        throw new Error('Ödeme sonucu alınamadı.')
      }

      if (paymentIntent.status !== 'succeeded') {
        setPaymentMessage('Ödeme işleniyor. Bakiye birkaç saniye içinde güncellenir.')
        return
      }

      const syncResult = await sendAuthorizedRequest(
        `/api/wallet/deposits/payment-intents/${encodeURIComponent(paymentIntent.id)}/sync`,
        { method: 'POST' },
      )

      if (!syncResult.response.ok) {
        throw new Error(
          getApiErrorMessage(syncResult.payload, 'Ödeme onayı alınamadı.'),
        )
      }

      setPaymentMessage('Yükleme tamamlandı.')
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
        disabled={!stripe || !elements || isSubmitting}
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
