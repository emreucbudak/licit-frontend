import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
const RECENT_TRANSACTION_PAGE_SIZE = 5
const EXPANDED_TRANSACTION_PAGE_SIZE = 10

const moneyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const ethFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const walletActions = {
  deposit: {
    endpoint: '/api/wallet/deposit',
    icon: 'arrow_downward',
    label: 'Deposit',
    successMessage: 'Deposit completed.',
  },
  withdraw: {
    endpoint: '/api/wallet/withdraw',
    icon: 'arrow_upward',
    label: 'Withdraw',
    successMessage: 'Withdraw completed.',
  },
}

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

function normalizeTransactionPage(payload, requestedPage, requestedPageSize) {
  const transactions = normalizeTransactions(payload)
  const totalCount =
    readField(payload, 'totalCount', 'TotalCount') ??
    readField(payload, 'total_count', 'Total') ??
    transactions.length

  return {
    page: toNumber(readField(payload, 'page', 'Page')) || requestedPage,
    pageSize:
      toNumber(readField(payload, 'pageSize', 'PageSize')) ||
      toNumber(readField(payload, 'page_size', 'PerPage')) ||
      requestedPageSize,
    totalCount: toNumber(totalCount),
    transactions,
  }
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
  const isMountedRef = useRef(false)
  const [balance, setBalance] = useState({
    balance: 0,
    frozenBalance: 0,
    totalBalance: 0,
    updatedAt: '',
    walletId: '',
  })
  const [transactions, setTransactions] = useState([])
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionPageSize, setTransactionPageSize] = useState(
    RECENT_TRANSACTION_PAGE_SIZE,
  )
  const [transactionTotalCount, setTransactionTotalCount] = useState(0)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [walletError, setWalletError] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [actionAmount, setActionAmount] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [isActionSubmitting, setIsActionSubmitting] = useState(false)

  const loadWallet = useCallback(
    async ({
      page = 1,
      pageSize = RECENT_TRANSACTION_PAGE_SIZE,
      silent = false,
    } = {}) => {
      const requestedPage = page
      const requestedPageSize = pageSize

      if (!silent) {
        setIsLoading(true)
      }
      setWalletError('')

      try {
        const balanceResult = await sendAuthorizedRequest('/api/wallet/balance')
        const transactionsResult = await sendAuthorizedRequest(
          `/api/wallet/transactions?page=${requestedPage}&pageSize=${requestedPageSize}`,
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

        if (!isMountedRef.current) {
          return
        }

        setBalance(normalizeBalance(balanceResult.payload))
        const transactionData = normalizeTransactionPage(
          transactionsResult.payload,
          requestedPage,
          requestedPageSize,
        )
        setTransactions(transactionData.transactions)
        setTransactionPage(transactionData.page)
        setTransactionPageSize(transactionData.pageSize)
        setTransactionTotalCount(transactionData.totalCount)
      } catch (error) {
        if (isMountedRef.current) {
          setWalletError(error.message || 'Cuzdan bilgileri yuklenemedi.')
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    isMountedRef.current = true
    loadWallet()

    return () => {
      isMountedRef.current = false
    }
  }, [loadWallet])

  const renderedTransactions = useMemo(
    () => transactions.map(mapTransaction),
    [transactions],
  )

  const activeAction = selectedAction ? walletActions[selectedAction] : null
  const transactionTotalPages = Math.max(
    1,
    Math.ceil(transactionTotalCount / transactionPageSize),
  )
  const transactionRangeStart =
    transactionTotalCount === 0
      ? 0
      : (transactionPage - 1) * transactionPageSize + 1
  const transactionRangeEnd = Math.min(
    transactionPage * transactionPageSize,
    transactionTotalCount,
  )
  const transactionPageNumbers = useMemo(() => {
    const firstPage = Math.max(
      1,
      Math.min(transactionPage - 1, transactionTotalPages - 2),
    )

    return Array.from(
      { length: Math.min(3, transactionTotalPages) },
      (_, index) => firstPage + index,
    ).filter((pageNumber) => pageNumber <= transactionTotalPages)
  }, [transactionPage, transactionTotalPages])
  const showTransactionPagination =
    isHistoryExpanded && (transactionTotalPages > 1 || transactionTotalCount > transactions.length)

  function handleActionSelect(action) {
    setSelectedAction(action)
    setActionAmount('')
    setActionError('')
    setActionMessage('')
  }

  function handleActionCancel() {
    setSelectedAction('')
    setActionAmount('')
    setActionError('')
    setActionMessage('')
  }

  async function handleActionSubmit(event) {
    event.preventDefault()

    if (!activeAction) {
      return
    }

    const amount = Number(actionAmount)

    setActionError('')
    setActionMessage('')

    if (!Number.isFinite(amount) || amount <= 0) {
      setActionError('Amount must be greater than 0.')
      return
    }

    if (selectedAction === 'withdraw' && amount > balance.balance) {
      setActionError('Amount cannot exceed available balance.')
      return
    }

    setIsActionSubmitting(true)

    try {
      const result = await sendAuthorizedRequest(activeAction.endpoint, {
        body: { amount },
        headers:
          selectedAction === 'deposit'
            ? { 'Idempotency-Key': createIdempotencyKey() }
            : {},
        method: 'POST',
      })

      if (!result.response.ok) {
        throw new Error(
          getApiErrorMessage(result.payload, `${activeAction.label} failed.`),
        )
      }

      setActionAmount('')
      setActionMessage(activeAction.successMessage)
      await loadWallet({ page: transactionPage, pageSize: transactionPageSize, silent: true })
    } catch (error) {
      setActionError(error.message || `${activeAction.label} failed.`)
    } finally {
      setIsActionSubmitting(false)
    }
  }

  function handleHistoryToggle() {
    const nextExpanded = !isHistoryExpanded

    setIsHistoryExpanded(nextExpanded)
    loadWallet({
      page: 1,
      pageSize: nextExpanded
        ? EXPANDED_TRANSACTION_PAGE_SIZE
        : RECENT_TRANSACTION_PAGE_SIZE,
      silent: true,
    })
  }

  function handleTransactionPageChange(nextPage) {
    const clampedPage = Math.min(Math.max(nextPage, 1), transactionTotalPages)

    if (clampedPage === transactionPage) {
      return
    }

    loadWallet({
      page: clampedPage,
      pageSize: transactionPageSize,
      silent: true,
    })
  }

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
                  onClick={() => handleActionSelect('deposit')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_downward
                  </span>
                  Deposit
                </button>
                <button
                  className="flex min-w-36 flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright"
                  onClick={() => handleActionSelect('withdraw')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_upward
                  </span>
                  Withdraw
                </button>
                <button
                  className="flex min-w-36 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-highest py-3 text-sm font-medium text-on-surface-variant opacity-70"
                  disabled
                  title="Transfer API yok / not available yet"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    swap_horiz
                  </span>
                  Transfer
                </button>
              </div>

              <div className="relative z-10 mt-3 text-xs text-on-surface-variant">
                Transfer API yok / not available yet.
              </div>

              {activeAction ? (
                <form
                  className="relative z-10 mt-6 rounded-lg border border-outline-variant/20 bg-surface-container-highest p-4"
                  onSubmit={handleActionSubmit}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                      <label
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-on-surface"
                        htmlFor="wallet-action-amount"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                          {activeAction.icon}
                        </span>
                        {activeAction.label} amount
                      </label>
                      <input
                        className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant focus:border-primary"
                        disabled={isActionSubmitting}
                        id="wallet-action-amount"
                        inputMode="decimal"
                        min="0"
                        onChange={(event) => setActionAmount(event.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={actionAmount}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                        disabled={isActionSubmitting}
                        type="submit"
                      >
                        {isActionSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        className="rounded-lg border border-outline-variant/20 px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-bright disabled:cursor-wait disabled:opacity-60"
                        disabled={isActionSubmitting}
                        onClick={handleActionCancel}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {actionError ? (
                    <p className="mt-3 text-sm text-error">{actionError}</p>
                  ) : null}
                  {actionMessage ? (
                    <p className="mt-3 text-sm text-secondary">
                      {actionMessage}
                    </p>
                  ) : null}
                </form>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl bg-surface-container-low">
            <div className="flex items-center justify-between border-b border-outline-variant/10 p-6">
              <h2 className="text-xl font-bold text-on-surface">Recent Activity</h2>
              <button
                className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-container"
                onClick={handleHistoryToggle}
                type="button"
              >
                {isHistoryExpanded ? 'Show Recent' : 'View All'}
                <span className="material-symbols-outlined text-[18px]">
                  {isHistoryExpanded ? 'history' : 'arrow_forward'}
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

            {isHistoryExpanded ? (
              <div className="flex flex-col gap-3 border-t border-outline-variant/10 px-6 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {isLoading
                    ? 'Wallet activity is loading.'
                    : `Showing ${transactionRangeStart}-${transactionRangeEnd} of ${transactionTotalCount} transactions.`}
                </p>
                {showTransactionPagination ? (
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Previous transaction page"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading || transactionPage <= 1}
                      onClick={() => handleTransactionPageChange(transactionPage - 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        chevron_left
                      </span>
                    </button>
                    {transactionPageNumbers.map((pageNumber) => (
                      <button
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-bold transition-colors ${
                          pageNumber === transactionPage
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                        }`}
                        disabled={isLoading}
                        key={pageNumber}
                        onClick={() => handleTransactionPageChange(pageNumber)}
                        type="button"
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      aria-label="Next transaction page"
                      className="grid h-9 w-9 place-items-center rounded-lg bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-bright disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading || transactionPage >= transactionTotalPages}
                      onClick={() => handleTransactionPageChange(transactionPage + 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        chevron_right
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  )
}

export default WalletPage
