import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'

const transactions = [
  {
    id: '#TX-8492A',
    icon: 'gavel',
    description: 'Won Auction: Patek Philippe Nautilus',
    date: 'Oct 24, 2023',
    time: '14:32',
    amount: '-$45,000.00',
    amountTone: 'text-on-surface',
    status: 'Completed',
    statusTone: 'secondary',
  },
  {
    id: '#TX-8491B',
    icon: 'arrow_downward',
    description: 'Wire Transfer Deposit',
    date: 'Oct 22, 2023',
    time: '09:15',
    amount: '+$100,000.00',
    amountTone: 'text-secondary',
    status: 'Completed',
    statusTone: 'secondary',
  },
  {
    id: '#TX-8488C',
    icon: 'currency_exchange',
    description: 'ETH Purchase',
    date: 'Oct 18, 2023',
    time: '11:05',
    amount: '-$12,500.00',
    amountTone: 'text-on-surface',
    status: 'Pending',
    statusTone: 'outline',
  },
  {
    id: '#TX-8475D',
    icon: 'arrow_upward',
    description: 'Withdrawal to Bank ****4092',
    date: 'Oct 10, 2023',
    time: '16:45',
    amount: '-$5,000.00',
    amountTone: 'text-on-surface',
    status: 'Failed',
    statusTone: 'tertiary',
  },
]

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

function WalletPage({ navigate, onLogout }) {
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
                    $142,500.00
                  </span>
                  <span className="flex items-center rounded bg-secondary/10 px-2 py-1 text-sm font-medium text-secondary">
                    <span className="material-symbols-outlined mr-1 text-[16px]">
                      trending_up
                    </span>
                    +2.4%
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm tracking-wide text-on-surface-variant">
                  ≈ 42.15 ETH
                </p>
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
                  {transactions.map((transaction) => (
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
                  ))}
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
