import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import { runtimeConfig } from '../../shared/config/runtimeConfig'
import WalletPaymentForm from './WalletPaymentForm'

const moneyFormatter = new Intl.NumberFormat('tr-TR', {
  currency: 'TRY',
  style: 'currency',
})

const defaultAmount = 500
const minimumTopUpAmount = 1
const maximumTopUpAmount = 100000
const maxWholeDigitCount = String(maximumTopUpAmount).length
const maxDecimalDigitCount = 2
const presetAmounts = [250, 500, 1000, 2500]

function parseAmount(value) {
  const normalizedValue = String(value || '').replace(',', '.')
  const amount = Number(normalizedValue)
  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(value) {
  return moneyFormatter.format(Number(value) || 0)
}

function normalizeAmountInput(value) {
  const cleanedValue = String(value || '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
  const [rawWholePart = '', rawDecimalPart = ''] = cleanedValue.split('.')
  const wholePart =
    rawWholePart.replace(/^0+(?=\d)/, '').slice(0, maxWholeDigitCount) || '0'
  const hasDecimalPart = cleanedValue.includes('.')
  const decimalPart = rawDecimalPart
    .replace(/\D/g, '')
    .slice(0, maxDecimalDigitCount)
  const normalizedValue = hasDecimalPart
    ? `${wholePart}.${decimalPart}`
    : wholePart

  if (parseAmount(normalizedValue) > maximumTopUpAmount) {
    return String(maximumTopUpAmount)
  }

  return normalizedValue === '0' && !String(value || '').startsWith('0')
    ? ''
    : normalizedValue
}

function WalletTopUpPage({ navigate, onLogout }) {
  const stripePromise = useMemo(
    () =>
      runtimeConfig.stripePublishableKey
        ? loadStripe(runtimeConfig.stripePublishableKey)
        : null,
    [],
  )
  const [amountInput, setAmountInput] = useState(String(defaultAmount))
  const [pageError, setPageError] = useState('')
  const [pageMessage, setPageMessage] = useState('')

  const amount = parseAmount(amountInput)
  const amountMinor = Math.round(amount * 100)
  const elementsAmountMinor =
    amount >= minimumTopUpAmount && amount <= maximumTopUpAmount
      ? amountMinor
      : defaultAmount * 100
  const formattedAmount = formatMoney(amount)
  const isAmountInRange =
    amount >= minimumTopUpAmount && amount <= maximumTopUpAmount
  const amountHelperText = `${formatMoney(minimumTopUpAmount)} - ${formatMoney(maximumTopUpAmount)} arası yükleme yapabilirsin.`
  const paymentSubtitle = `${formattedAmount} için ödeme`

  function handlePaymentSucceeded(result) {
    setPageMessage(
      result?.applied
        ? `${formatMoney(result.amount ?? amount)} cüzdana yüklendi.`
        : 'Ödeme alındı, bakiye güncelleniyor.',
    )
  }

  const elementsOptions = stripePromise
    ? {
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
        amount: elementsAmountMinor,
        currency: 'try',
        locale: 'tr',
        mode: 'payment',
      }
    : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface text-on-surface">
      <AppTopNavbar
        currentPath="/wallet"
        navigate={navigate}
        searchPlaceholder="İhale ara..."
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
            <div className="min-w-0 break-words rounded-lg border border-error/20 bg-error-container/20 px-5 py-4 text-sm text-on-error-container [overflow-wrap:anywhere]">
              {pageError}
            </div>
          ) : null}
          {pageMessage ? (
            <div className="min-w-0 break-words rounded-lg border border-secondary/20 bg-secondary/10 px-5 py-4 text-sm text-secondary [overflow-wrap:anywhere]">
              {pageMessage}
            </div>
          ) : null}

          <section className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-surface-container-low p-6">
              <div>
                <div className="mb-6">
                  <label
                    className="mb-2 block text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="wallet-top-up-amount"
                  >
                    Tutar seç
                  </label>
                  <div className="box-border flex h-24 min-w-0 items-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface px-4 py-3 focus-within:border-primary">
                    <span className="mr-3 shrink-0 text-sm font-semibold text-on-surface-variant">
                      TRY
                    </span>
                    <input
                      className="w-0 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap bg-transparent text-2xl font-black text-on-surface outline-none sm:text-3xl"
                      id="wallet-top-up-amount"
                      inputMode="decimal"
                      onChange={(event) =>
                        setAmountInput(normalizeAmountInput(event.target.value))
                      }
                      type="text"
                      value={amountInput}
                    />
                  </div>
                  <p className="mt-2 min-w-0 break-words text-xs text-on-surface-variant [overflow-wrap:anywhere]">
                    {amountHelperText}
                  </p>
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

              <div className="rounded-lg bg-surface-container-highest p-4">
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

            <div className="flex h-full min-h-[360px] min-w-0 flex-col overflow-hidden rounded-xl bg-surface-container-low p-6">
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

              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {stripePromise && elementsOptions ? (
                  <Elements options={elementsOptions} stripe={stripePromise}>
                    <WalletPaymentForm
                      amount={amount}
                      amountMinor={elementsAmountMinor}
                      formattedAmount={formattedAmount}
                      isAmountValid={isAmountInRange}
                      maximumAmount={maximumTopUpAmount}
                      minimumAmount={minimumTopUpAmount}
                      onPaymentStarted={() => {
                        setPageError('')
                        setPageMessage('')
                      }}
                      onPaymentSucceeded={handlePaymentSucceeded}
                    />
                  </Elements>
                ) : (
                  <div className="grid min-h-64 flex-1 place-items-center rounded-lg border border-dashed border-outline-variant/30 bg-surface/60 p-6 text-center text-sm text-on-surface-variant">
                    Stripe publishable key tanımlı değil.
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
