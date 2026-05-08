import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

function WalletPaymentForm({ amount, onPaymentSucceeded }) {
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-outline-variant/20 bg-surface p-4">
        <PaymentElement />
      </div>

      {paymentError ? (
        <p className="text-sm text-error">{paymentError}</p>
      ) : null}
      {paymentMessage ? (
        <p className="text-sm text-secondary">{paymentMessage}</p>
      ) : null}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        disabled={!stripe || !elements || isSubmitting}
        type="submit"
      >
        <span className="material-symbols-outlined text-[18px]">
          credit_card
        </span>
        {isSubmitting ? 'İşleniyor...' : `${amount} yükle`}
      </button>
    </form>
  )
}

export default WalletPaymentForm
