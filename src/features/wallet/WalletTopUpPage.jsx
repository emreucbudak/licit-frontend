import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const defaultAmount = 500
const maxAmountInputLength = 14
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

function normalizeAmountInput(value) {
  return String(value || '')
    .replace(/[^\d,.]/g, '')
    .slice(0, maxAmountInputLength)
}

function WalletTopUpPage({ navigate, onLogout }) {
  const paymentIntentRequestIdRef = useRef(0)
  const stripePromise = useMemo(
    () =>
      runtimeConfig.stripePublishableKey
        ? loadStripe(runtimeConfig.stripePublishableKey)
        : null,
    [],
  )
  const [amountInput, setAmountInput] = useState(String(defaultAmount))
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [pageError, setPageError] = useState('')
  const [pageMessage, setPageMessage] = useState('')
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  const amount = parseAmount(amountInput)
  const paymentIntentAmount = Number(paymentIntent?.amount) || 0
  const paymentAmount = paymentIntentAmount || amount
  const formattedAmount = formatMoney(amount)
  const formattedPaymentAmount = formatMoney(paymentAmount)
  const paymentSubtitle = paymentIntent
    ? `${formattedPaymentAmount} için ödeme`
    : 'Ödeme formu hazırlanıyor.'
  const isPaymentIntentCurrent =
    Boolean(paymentIntent?.clientSecret) && paymentIntentAmount === amount

  const createPaymentIntent = useCallback(async (nextAmount) => {
    setPageError('')
    setPageMessage('')
    setPaymentIntent(null)

    if (!runtimeConfig.stripePublishableKey) {
      setPageError('Stripe publishable key tanımlı değil.')
      return
    }

    if (nextAmount <= 0) {
      return
    }

    const requestId = paymentIntentRequestIdRef.current + 1
    paymentIntentRequestIdRef.current = requestId
    setIsCreatingIntent(true)

    try {
      const result = await sendAuthorizedRequest('/api/wallet/deposits/payment-intents', {
        body: { amount: nextAmount },
        headers: { 'Idempotency-Key': createIdempotencyKey() },
        method: 'POST',
      })

      if (!result.response.ok) {
        throw new Error(
          getApiErrorMessage(result.payload, 'Ödeme formu hazırlanamadı.'),
        )
      }

      if (requestId === paymentIntentRequestIdRef.current) {
        setPaymentIntent(result.payload)
      }
    } catch (error) {
      if (requestId === paymentIntentRequestIdRef.current) {
        setPageError(
          getUserFacingErrorMessage(error, 'Ödeme formu hazırlanamadı.'),
        )
      }
    } finally {
      if (requestId === paymentIntentRequestIdRef.current) {
        setIsCreatingIntent(false)
      }
    }
  }, [])

  useEffect(() => {
    if (amount <= 0) {
      paymentIntentRequestIdRef.current += 1
      setPaymentIntent(null)
      setIsCreatingIntent(false)
      return
    }

    if (isCreatingIntent) {
      return
    }

    if (isPaymentIntentCurrent) {
      return
    }

    const delay = paymentIntent ? 650 : 0
    const timerId = setTimeout(() => {
      createPaymentIntent(amount)
    }, delay)

    return () => clearTimeout(timerId)
  }, [amount, createPaymentIntent, isCreatingIntent, isPaymentIntentCurrent, paymentIntent])

  function handlePaymentSucceeded(result) {
    setPageMessage(
      result?.applied
        ? `${formatMoney(result.amount ?? paymentAmount)} cüzdana yüklendi.`
        : 'Ödeme alındı, bakiye güncelleniyor.',
    )
  }

  const elementsOptions = paymentIntent?.clientSecret
    ? {
        clientSecret: paymentIntent.clientSecret,
        locale: 'tr',
        appearance: {
          theme: 'night',
          variables: {
            borderRadius: '8px',
            colorBackground: '#131b2e',
            colorDanger: '#ffb4ab',
            colorPrimary: '#c0c1ff',
            colorText: '#dae2fd',
            colorTextPlaceholder: '#908fa0',
            colorTextSecondary: '#c7c4d7',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          rules: {
            '.Input': {
              backgroundColor: '#0b1326',
              border: '1px solid #464554',
            },
            '.Input:focus': {
              border: '1px solid #c0c1ff',
              boxShadow: '0 0 0 1px #c0c1ff',
            },
            '.Label': {
              color: '#c7c4d7',
            },
            '.Tab': {
              backgroundColor: '#0b1326',
              border: '1px solid #464554',
            },
            '.Tab--selected': {
              border: '1px solid #c0c1ff',
            },
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
            <div className="break-words rounded-lg border border-error/20 bg-error-container/20 px-5 py-4 text-sm text-on-error-container">
              {pageError}
            </div>
          ) : null}
          {pageMessage ? (
            <div className="break-words rounded-lg border border-secondary/20 bg-secondary/10 px-5 py-4 text-sm text-secondary">
              {pageMessage}
            </div>
          ) : null}

          <section className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex h-full min-h-[360px] flex-col rounded-xl bg-surface-container-low p-6">
              <div>
                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="wallet-top-up-amount"
                  >
                    Tutar seç
                  </label>
                  <div className="flex min-h-24 min-w-0 items-center rounded-lg border border-outline-variant/30 bg-surface px-4 py-3 focus-within:border-primary">
                    <span className="mr-3 shrink-0 text-sm font-semibold text-on-surface-variant">
                      TRY
                    </span>
                    <input
                      className="min-w-0 flex-1 truncate bg-transparent text-2xl font-black text-on-surface outline-none sm:text-3xl"
                      id="wallet-top-up-amount"
                      inputMode="decimal"
                      maxLength={maxAmountInputLength}
                      onChange={(event) =>
                        setAmountInput(normalizeAmountInput(event.target.value))
                      }
                      type="text"
                      value={amountInput}
                    />
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-2">
                  {presetAmounts.map((presetAmount) => (
                    <button
                      className={`min-w-0 overflow-hidden rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                        amount === presetAmount
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant/20 bg-surface-container-highest text-on-surface hover:bg-surface-bright'
                      }`}
                      key={presetAmount}
                      onClick={() => setAmountInput(String(presetAmount))}
                      type="button"
                    >
                      <span className="block truncate">
                        {formatMoney(presetAmount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto rounded-lg bg-surface-container-highest p-4">
                <div className="flex min-w-0 items-center justify-between gap-4 text-sm text-on-surface-variant">
                  <span className="shrink-0">Yüklenecek bakiye</span>
                  <strong
                    className="min-w-0 truncate text-right text-lg text-on-surface"
                    title={formattedAmount}
                  >
                    {formattedAmount}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex h-full min-h-[360px] flex-col rounded-xl bg-surface-container-low p-6">
              <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-on-surface">
                    Kart Bilgileri
                  </h2>
                  <p
                    className="max-w-full truncate text-sm text-on-surface-variant"
                    title={paymentSubtitle}
                  >
                    {paymentSubtitle}
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-container-highest">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    encrypted
                  </span>
                </span>
              </div>

              <div className="flex flex-1 flex-col">
                {stripePromise && elementsOptions ? (
                  <Elements
                    key={paymentIntent.clientSecret}
                    options={elementsOptions}
                    stripe={stripePromise}
                  >
                    <WalletPaymentForm
                      onPaymentSucceeded={handlePaymentSucceeded}
                    />
                  </Elements>
                ) : (
                  <div className="grid min-h-64 flex-1 place-items-center rounded-lg border border-dashed border-outline-variant/30 bg-surface/60 p-6 text-center text-sm text-on-surface-variant">
                    {isCreatingIntent
                      ? 'Ödeme formu hazırlanıyor.'
                      : 'Ödeme formu bekleniyor.'}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default WalletTopUpPage
