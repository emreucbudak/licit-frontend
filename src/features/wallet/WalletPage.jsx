import { useEffect, useMemo, useState } from 'react'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import { getApiErrorMessage } from '../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'

const statusStyles = {
  secondary: 'border-secondary/20 bg-secondary/10 text-secondary',
  outline: 'border-outline/20 bg-outline/10 text-on-surface-variant',
  tertiary: 'border-tertiary/20 bg-tertiary/10 text-tertiary',
}

const statusDotStyles = {
  secondary: 'bg-secondary',
  outline: 'bg-outline',
  tertiary: 'bg-tertiary',
}

const transactionIconByType = {
  Deduct: 'gavel',
  Deposit: 'arrow_downward',
  Freeze: 'lock',
  Unfreeze: 'undo',
  Withdraw: 'arrow_upward',
}

const positiveTransactionTypes = new Set(['Deposit', 'Unfreeze'])
const reservedTransactionTypes = new Set(['Freeze'])

const moneyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const ethFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

function readField(source, camelCaseKey, pascalCaseKey) {
  return source?.[camelCaseKey] ?? source?.[pascalCaseKey]
}

function toNumber(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function formatMoney(value) {
  return moneyFormatter.format(toNumber(value))
}

function formatEthEquivalent(value) {
  return `≈ ${ethFormatter.format(toNumber(value) / 3380)} ETH`
}

function formatTransactionId(id) {
  const cleanId = String(id || '').replaceAll('-', '').toUpperCase()
  return cleanId ? `#TX-${cleanId.slice(0, 6)}` : '#TX-NEW'
}

function formatDateParts(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return {
      date: '-',
      time: '',
    }
  }

  return {
    date: new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  }
}

function normalizeBalance(payload) {
  return {
    balance: toNumber(readField(payload, 'balance', 'Balance')),
    frozenBalance: toNumber(readField(payload, 'frozenBalance', 'FrozenBalance')),
    totalBalance: toNumber(readField(payload, 'totalBalance', 'TotalBalance')),
    updatedAt: readField(payload, 'updatedAt', 'UpdatedAt'),
    walletId: readField(payload, 'walletId', 'WalletId'),
  }
}

function normalizeTransactions(payload) {
  const transactions = readField(payload, 'transactions', 'Transactions')
  return Array.isArray(transactions) ? transactions : []
}

function mapTransaction(transaction) {
  const id = readField(transaction, 'id', 'Id')
  const type = readField(transaction, 'type', 'Type') || 'Transaction'
  const amount = toNumber(readField(transaction, 'amount', 'Amount'))
  const description = readField(transaction, 'description', 'Description') || type
  const createdAt = readField(transaction, 'createdAt', 'CreatedAt')
  const dateParts = formatDateParts(createdAt)
  const isPositive = positiveTransactionTypes.has(type)
  const isReserved = reservedTransactionTypes.has(type)

  return {
    id: formatTransactionId(id),
    amount: `${isPositive ? '+' : '-'}${formatMoney(Math.abs(amount))}`,
    amountTone: isPositive ? 'text-secondary' : 'text-on-surface',
    date: dateParts.date,
    description,
    icon: transactionIconByType[type] || 'currency_exchange',
    status: isReserved ? 'Reserved' : 'Completed',
    statusTone: isReserved ? 'outline' : 'secondary',
    time: dateParts.time,
  }
}

function WalletPage({ navigate, onLogout }) {
  const [balance, setBalance] = useState({
    balance: 0,
    frozenBalance: 0,
    totalBalance: 0,
    updatedAt: '',
    walletId: '',
  })
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [walletError, setWalletError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadWallet() {
      setIsLoading(true)
      setWalletError('')

      try {
        const balanceResult = await sendAuthorizedRequest('/api/wallet/balance')
        const transactionsResult = await sendAuthorizedRequest(
          '/api/wallet/transactions?page=1&pageSize=20',
        )

        if (!balanceResult.response.ok) {
          throw new Error(
            getApiErrorMessage(
              balanceResult.payload,
              'Cuzdan bakiyesi alinamadi.',
            ),
          )
        }

        if (!transactionsResult.response.ok) {
          throw new Error(
            getApiErrorMessage(
              transactionsResult.payload,
              'Cuzdan hareketleri alinamadi.',
            ),
          )
        }

        if (!isCurrent) {
          return
        }

        setBalance(normalizeBalance(balanceResult.payload))
        setTransactions(normalizeTransactions(transactionsResult.payload))
      } catch (error) {
        if (isCurrent) {
          setWalletError(error.message || 'Cuzdan bilgileri yuklenemedi.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadWallet()

    return () => {
      isCurrent = false
    }
  }, [])

  const renderedTransactions = useMemo(
    () => transactions.map(mapTransaction),
    [transactions],
  )

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

      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 md:p-10 lg:ml-64 lg:p-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <header>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Financial Hub
            </h1>
            <p className="text-lg text-on-surface-variant">
              Manage your liquidity and portfolio assets.
            </p>
          </header>

          {walletError ? (
            <div className="rounded-xl border border-error/20 bg-error-container/20 px-5 py-4 text-sm text-on-error-container">
              {walletError}
            </div>
          ) : null}

          <section className="grid grid-cols-1 gap-6">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low p-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"></div>
              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    account_balance
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                    Available Liquidity
                  </h2>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-4">
                  <span className="text-5xl font-black tracking-tight text-on-surface md:text-6xl">
                    {isLoading ? 'Loading...' : formatMoney(balance.balance)}
                  </span>
                  <span className="flex items-center rounded bg-secondary/10 px-2 py-1 text-sm font-medium text-secondary">
                    <span className="material-symbols-outlined mr-1 text-[16px]">
                      sync
                    </span>
                    Live
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm tracking-wide text-on-surface-variant">
                  {isLoading ? 'Syncing wallet...' : formatEthEquivalent(balance.balance)}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-on-surface-variant">
                  <span className="rounded bg-surface-container-high px-3 py-1">
                    Frozen: {formatMoney(balance.frozenBalance)}
                  </span>
                  <span className="rounded bg-surface-container-high px-3 py-1">
                    Total: {formatMoney(balance.totalBalance)}
                  </span>
                </div>
              </div>

              <div className="relative z-10 mt-10 flex flex-wrap gap-4 border-t border-outline-variant/10 pt-6">
                <button
                  className="flex min-w-36 flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_downward
                  </span>
                  Deposit
                </button>
                <button
                  className="flex min-w-36 flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_upward
                  </span>
                  Withdraw
                </button>
                <button
                  className="flex min-w-36 flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    swap_horiz
                  </span>
                  Transfer
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl bg-surface-container-low">
            <div className="flex items-center justify-between border-b border-outline-variant/10 p-6">
              <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
              <button
                className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-container"
                type="button"
              >
                View All
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-lowest/50 text-xs uppercase tracking-wider text-on-surface-variant">
                    <th className="p-4 pl-6 font-medium">Transaction ID</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 text-right font-medium">Amount</th>
                    <th className="p-4 pr-6 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {isLoading ? (
                    <tr>
                      <td className="p-6 text-on-surface-variant" colSpan="5">
                        Wallet activity is loading...
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && renderedTransactions.length === 0 ? (
                    <tr>
                      <td className="p-6 text-on-surface-variant" colSpan="5">
                        No wallet activity yet.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading
                    ? renderedTransactions.map((transaction) => (
                        <tr
                          className="group transition-colors hover:bg-surface-container-high/50"
                          key={transaction.id}
                        >
                          <td className="p-4 pl-6 font-mono text-on-surface-variant transition-colors group-hover:text-primary">
                            {transaction.id}
                          </td>
                          <td className="p-4 font-medium text-on-surface">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-container">
                                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                                  {transaction.icon}
                                </span>
                              </div>
                              {transaction.description}
                            </div>
                          </td>
                          <td className="p-4 text-on-surface-variant">
                            {transaction.date}
                            <span className="ml-1 text-xs opacity-60">
                              {transaction.time}
                            </span>
                          </td>
                          <td className={`p-4 text-right font-mono font-medium ${transaction.amountTone}`}>
                            {transaction.amount}
                          </td>
                          <td className="p-4 pr-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[transaction.statusTone]}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[transaction.statusTone]}`}></span>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default WalletPage
