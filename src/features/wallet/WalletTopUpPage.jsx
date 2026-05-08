import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'
import { runtimeConfig } from '../../shared/config/runtimeConfig'
import WalletPaymentForm from './WalletPaymentForm'

const moneyFormatter = new Intl.NumberFormat('tr-TR', {
  currency: 'TRY',
  style: 'currency',
})

const presetAmounts = [250, 500, 1000, 2500]

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

function parseAmount(value) {
  const normalizedValue = String(value || '').replace(',', '.')
  const amount = Number(normalizedValue)
  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(value) {
  return moneyFormatter.format(Number(value) || 0)
}

function WalletTopUpPage({ navigate, onLogout }) {
  const stripePromise = useMemo(
    () =>
      runtimeConfig.stripePublishableKey
        ? loadStripe(runtimeConfig.stripePublishableKey)
        : null,
    [],
  )
  const [amountInput, setAmountInput] = useState('500')
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [pageError, setPageError] = useState('')
  const [pageMessage, setPageMessage] = useState('')
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  const amount = parseAmount(amountInput)
  const canCreatePayment = amount > 0 && !isCreatingIntent
  const formattedAmount = formatMoney(amount)

  async function handleCreatePayment(event) {
    event.preventDefault()

    setPageError('')
    setPageMessage('')
    setPaymentIntent(null)

    if (!runtimeConfig.stripePublishableKey) {
      setPageError('Stripe publishable key tanımlı değil.')
      return
    }

    if (amount <= 0) {
      setPageError('Tutar 0’dan büyük olmalı.')
      return
    }

    setIsCreatingIntent(true)

    try {
      const result = await sendAuthorizedRequest('/api/wallet/deposits/payment-intents', {
        body: { amount },
        headers: { 'Idempotency-Key': createIdempotencyKey() },
        method: 'POST',
      })

      if (!result.response.ok) {
        throw new Error(
          getApiErrorMessage(result.payload, 'Ödeme formu hazırlanamadı.'),
        )
      }

      setPaymentIntent(result.payload)
    } catch (error) {
      setPageError(
        getUserFacingErrorMessage(error, 'Ödeme formu hazırlanamadı.'),
      )
    } finally {
      setIsCreatingIntent(false)
    }
  }

  function handlePaymentSucceeded(result) {
    setPageMessage(
      result?.applied
        ? `${formattedAmount} cüzdana yüklendi.`
        : 'Ödeme alındı, bakiye güncelleniyor.',
    )
  }

  const elementsOptions = paymentIntent?.clientSecret
    ? {
        clientSecret: paymentIntent.clientSecret,
        locale: 'tr',
        appearance: {
          theme: 'stripe',
          variables: {
            borderRadius: '8px',
            colorPrimary: '#6750a4',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      }
    : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar
        currentPath="/wallet"
        navigate={navigate}
        searchPlaceholder="Cüzdanda ara..."
      />
      <AppSideNavbar
        currentPath="/wallet"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="min-h-screen px-4 pb-16 pt-28 sm:px-6 sm:pt-28 md:px-10 md:pb-10 md:pt-32 lg:ml-64 lg:px-12 lg:pb-12 lg:pt-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                Cüzdan Yükle
              </h1>
              <p className="text-lg text-on-surface-variant">
                Kartla güvenli bakiye yükleme.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/20 px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              onClick={navigate('/wallet')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Cüzdana dön
            </button>
          </header>

          {pageError ? (
            <div className="rounded-lg border border-error/20 bg-error-container/20 px-5 py-4 text-sm text-on-error-container">
              {pageError}
            </div>
          ) : null}
          {pageMessage ? (
            <div className="rounded-lg border border-secondary/20 bg-secondary/10 px-5 py-4 text-sm text-secondary">
              {pageMessage}
            </div>
          ) : null}

          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              className="rounded-xl bg-surface-container-low p-6"
              onSubmit={handleCreatePayment}
            >
              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                  htmlFor="wallet-top-up-amount"
                >
                  Tutar
                </label>
                <div className="flex items-center rounded-lg border border-outline-variant/30 bg-surface px-4 py-3 focus-within:border-primary">
                  <span className="mr-3 text-sm font-semibold text-on-surface-variant">
                    TRY
                  </span>
                  <input
                    className="w-full bg-transparent text-3xl font-black text-on-surface outline-none"
                    disabled={isCreatingIntent}
                    id="wallet-top-up-amount"
                    inputMode="decimal"
                    min="1"
                    onChange={(event) => setAmountInput(event.target.value)}
                    step="0.01"
                    type="number"
                    value={amountInput}
                  />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2">
                {presetAmounts.map((presetAmount) => (
                  <button
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      amount === presetAmount
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant/20 bg-surface-container-highest text-on-surface hover:bg-surface-bright'
                    }`}
                    disabled={isCreatingIntent}
                    key={presetAmount}
                    onClick={() => setAmountInput(String(presetAmount))}
                    type="button"
                  >
                    {formatMoney(presetAmount)}
                  </button>
                ))}
              </div>

              <div className="mb-6 rounded-lg bg-surface-container-highest p-4">
                <div className="flex items-center justify-between text-sm text-on-surface-variant">
                  <span>Yüklenecek bakiye</span>
                  <strong className="text-lg text-on-surface">
                    {formattedAmount}
                  </strong>
                </div>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                disabled={!canCreatePayment}
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">
                  lock
                </span>
                {isCreatingIntent ? 'Hazırlanıyor...' : 'Ödeme formunu aç'}
              </button>
            </form>

            <div className="rounded-xl bg-surface-container-low p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">
                    Kart Bilgileri
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    {paymentIntent
                      ? `${formattedAmount} için ödeme`
                      : 'Tutar seçildikten sonra kart alanı açılır.'}
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-container-highest">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    encrypted
                  </span>
                </span>
              </div>

              {stripePromise && elementsOptions ? (
                <Elements
                  key={paymentIntent.clientSecret}
                  options={elementsOptions}
                  stripe={stripePromise}
                >
                  <WalletPaymentForm
                    amount={formattedAmount}
                    onPaymentSucceeded={handlePaymentSucceeded}
                  />
                </Elements>
              ) : (
                <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-outline-variant/30 bg-surface/60 p-6 text-center text-sm text-on-surface-variant">
                  Ödeme formu bekleniyor.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default WalletTopUpPage
