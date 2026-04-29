import { useEffect, useMemo, useState } from 'react'
import './DashboardPage.css'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'
import { getApiErrorMessage } from '../../shared/api/apiError'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'
import { buildApiUrl } from '../../shared/config/runtimeConfig'

const DASHBOARD_TENDER_PAGE_SIZE = 20
const DASHBOARD_TRANSACTION_PAGE_SIZE = 20

const fallbackAuctionImages = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBkI3FqStyasHTMFE8FS1K3VLwUo8Ge5kGEWA3G3oDKdWq1SgYZzk23bwpGo9TV9VhBmkk2li5FsqrPb47027MXVaosR0BdO73v7ZtPotCPTyxpfyS1DpGQvzPFMaTZrSZZOVQwnCeml1iQm964tjxJM8XhEO_Nr5RGo9KEpebYMJMemEGAL390KGbHPqXXlqCLm7WTEvXl0Xb21NtycUiPcHGch7WiFPH6lluE1d71a3q4Ok2g-RtXTXbCGZ7aMWaB7dF3fbakA4',
    alt: 'Soyut dijital koleksiyon gorseli',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdetb6oFJ3ij7DLDy4CGPi9RCLv3Wi5d_fBPOFt4naQ9o2YHzKKgIoYPq-73erRvIMDtsTlDi8m42nWV0JYynhKRth_9BqLFI7sQ-0GX-8gNMEbXi6XFyOfz8zfYVyT-ET0SCBfhqSSeS7xj96_ZaJ2D6JNp80PnPI4x5h-HODG_dSkGU_ns5z5H1ZKUaFptb2PCyibb7cgZP7hL7fOkgFdVjKqUXbrifBfa1BWO94Lsnpkz9ok-GZbp2KYvRlvYAGVKw12pehB5A',
    alt: 'Koleksiyon urunu gorseli',
  },
]

const openTenderStatuses = new Set([
  'active',
  'open',
  'live',
  'ongoing',
  'published',
  'approved',
  'aktif',
  'acik',
  'yayinda',
])

const bidHistory = [
  {
    date: '24 Eki 2023',
    item: 'Eterik Parca #09',
    bid: '1.85 ETH',
    status: 'Statik',
    tone: 'secondary',
    action: 'open',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBr-CET40p7xe2JZRsdifpVUdzRDnW_N6B53hWzUzKGtAcPNJIlnbBFegLubuOy_sWZ196Rw049IjExVzcT1qTXja2TdSL1-UABna93X5EeTVu6k2FXtnYEa4hKOtW5ZTbXBcmvaHsYpXENdMF8H8oKbMXOCI0pqYNei3zpc1s-FG8gCMdX-sVocLoewmol3Qf5785yJddoDkQRgMVPhLmSKE3QZ7BV-W3s606gBXggOMEJ73bYvW6M8qoJeeTHYRC4JLyMVQIaOUM',
  },
  {
    date: '23 Eki 2023',
    item: 'Leica M6 Classic',
    bid: '$3,200',
    status: 'Statik',
    tone: 'tertiary',
    action: 'rebid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAvvNOcDnV52ocok7HAe__OqGPJ4qfUmhhkocF1DRyXLzYwZGSi6FGjNQx-AT0nAQpBNSY9yOv51lVX-F2GrNrMhLvpYZtpNsWQR4P1IkCXPzwZBD_6hzuj7D38TZo8dp1Qe6P36VZv3vIA5JLMCWq8sN89DPXLyC8KnTWaT8k_GYAVIed89I5mGvecWr5QYJi0HbYq8cqtt31Txp1TLH3OSdsVPMeB8Du_IKR6DIXQWJ_WbYQXvr17fZNrKS0FL6z6DLAAAcA7lI',
  },
  {
    date: '21 Eki 2023',
    item: 'El Yazmasi Cilt 1',
    bid: '0.45 ETH',
    status: 'Statik',
    tone: 'secondary',
    action: 'open',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgPgSvv2SIDJexLtAX5i36LcHIJU3YZsntVFH_UDqN9iEQMer9y6xGriNv9hqTPnly6ByXF9vSV75jQaB75z-BaSp2hqVpSZTzJNiQsQYsetvaQDbbX9RfkSdcinHFGQgg9GDPya_Sy2LyeIHz3XKgG8F7wcYEiqjXwlmaOjhcaUV73FYK7YsArNxiqQS1wWe6oDfmOYedw0aAaZ81yd4Em6JTNUoT4A6j4laLRKfG96QC5QMxbC4x_SPz7TPbTqyK9LPRLx7XoY',
  },
  {
    date: '20 Eki 2023',
    item: 'Metropolis Gokyuzu #12',
    bid: '2.10 ETH',
    status: 'Statik',
    tone: 'tertiary',
    action: 'rebid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjMgIviHVgJs_xnHcZ8tb3ysG5gP9CE0OFq_2FvHwQ4wgc7L0DLjVIy8fj9ltPzNRa9M8QSGW27iqRhxvjnDv6h-RZuYOyqJZfZnA6-DS2urlmTDYvaULFo1cstRywgreKPaTRXZbRUdWDseapB0iGjPxOH2yPttliJKnq0ABlTPL6_ZXb4rJtVSKTKUTvX6TSe2qMqvoxFySQl69XKBDaqZOjy-p-OpBoAql1If0JaybrK17E2XE9tf_xC_e_3yTgRrWuvq-gO80',
  },
]

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase()
}

function isOpenTender(tender) {
  const normalizedStatus = normalizeStatus(tender.status)

  if (normalizedStatus) {
    return openTenderStatuses.has(normalizedStatus)
  }

  if (!tender.endDate) {
    return false
  }

  return new Date(tender.endDate).getTime() > Date.now()
}

function formatCurrency(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return '-'
  }

  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: 'currency',
    currency: 'TRY',
  }).format(numericValue)
}

function formatNumber(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return '0'
  }

  return new Intl.NumberFormat('tr-TR').format(numericValue)
}

function formatEndDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function readJsonResponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function fetchPublicTenders() {
  const response = await fetch(
    buildApiUrl(`/api/tender?page=1&pageSize=${DASHBOARD_TENDER_PAGE_SIZE}`),
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )
  const payload = await readJsonResponse(response)

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, 'Ilanlar alinamadi.'))
  }

  return payload
}

async function fetchWalletBalance() {
  const { payload, response } = await sendAuthorizedRequest('/api/wallet/balance')

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, 'Cuzdan bakiyesi alinamadi.'))
  }

  return payload
}

async function fetchWalletTransactions() {
  const { payload, response } = await sendAuthorizedRequest(
    `/api/wallet/transactions?page=1&pageSize=${DASHBOARD_TRANSACTION_PAGE_SIZE}`,
  )

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, 'Cuzdan hareketleri alinamadi.'))
  }

  return payload
}

function DashboardPage({ navigate, onLogout }) {
  const [dashboardData, setDashboardData] = useState({
    tenders: null,
    walletBalance: null,
    walletTransactions: null,
  })
  const [dashboardErrors, setDashboardErrors] = useState({})
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    async function loadDashboardData() {
      setIsDashboardLoading(true)
      setDashboardErrors({})

      const [tendersResult, balanceResult, transactionsResult] =
        await Promise.allSettled([
          fetchPublicTenders(),
          fetchWalletBalance(),
          fetchWalletTransactions(),
        ])

      if (!isCurrent) {
        return
      }

      const nextErrors = {}

      if (tendersResult.status === 'rejected') {
        nextErrors.tenders = tendersResult.reason.message
      }

      if (balanceResult.status === 'rejected') {
        nextErrors.walletBalance = balanceResult.reason.message
      }

      if (transactionsResult.status === 'rejected') {
        nextErrors.walletTransactions = transactionsResult.reason.message
      }

      setDashboardData({
        tenders:
          tendersResult.status === 'fulfilled' ? tendersResult.value : null,
        walletBalance:
          balanceResult.status === 'fulfilled' ? balanceResult.value : null,
        walletTransactions:
          transactionsResult.status === 'fulfilled'
            ? transactionsResult.value
            : null,
      })
      setDashboardErrors(nextErrors)
      setIsDashboardLoading(false)
    }

    loadDashboardData()

    return () => {
      isCurrent = false
    }
  }, [])

  const tenders = useMemo(
    () =>
      Array.isArray(dashboardData.tenders?.tenders)
        ? dashboardData.tenders.tenders
        : [],
    [dashboardData.tenders],
  )

  const openTenders = useMemo(
    () => tenders.filter((tender) => isOpenTender(tender)),
    [tenders],
  )

  const visibleTenders = useMemo(() => {
    const preferredTenders = openTenders.length > 0 ? openTenders : tenders

    return preferredTenders.slice(0, 3).map((tender, index) => {
      const fallbackImage =
        fallbackAuctionImages[index % fallbackAuctionImages.length]

      return {
        id: tender.id,
        title: tender.title || 'Basliksiz ilan',
        status: tender.status || 'Ilan',
        tone: isOpenTender(tender) ? 'secondary' : 'neutral',
        startingPrice: formatCurrency(tender.startingPrice),
        endsAt: formatEndDate(tender.endDate),
        image: fallbackImage.image,
        alt: fallbackImage.alt,
      }
    })
  }, [openTenders, tenders])

  const statsCards = useMemo(() => {
    const tenderTotal = dashboardData.tenders?.totalCount ?? tenders.length
    const transactionTotal =
      dashboardData.walletTransactions?.totalCount ??
      dashboardData.walletTransactions?.transactions?.length
    const walletBalance = dashboardData.walletBalance?.balance

    return [
      {
        label: 'Toplam Ilan',
        value: isDashboardLoading && !dashboardData.tenders ? '...' : formatNumber(tenderTotal),
        note: dashboardErrors.tenders || 'GET /api/tender toplam sayisi',
        tone: dashboardErrors.tenders ? 'neutral' : 'secondary',
        icon: 'inventory_2',
        noteIcon: dashboardErrors.tenders ? 'error' : 'dns',
      },
      {
        label: 'Sayfadaki Acik Ilan',
        value:
          isDashboardLoading && !dashboardData.tenders
            ? '...'
            : formatNumber(openTenders.length),
        note:
          openTenders.length > 0
            ? 'Duruma gore filtrelendi'
            : 'Son ilanlar gosteriliyor',
        tone: 'primary',
        icon: 'visibility',
        noteIcon: 'schedule',
      },
      {
        label: 'Cuzdan Bakiyesi',
        value:
          isDashboardLoading && !dashboardData.walletBalance
            ? '...'
            : formatCurrency(walletBalance),
        note:
          dashboardErrors.walletBalance ||
          dashboardErrors.walletTransactions ||
          (Number.isFinite(Number(transactionTotal))
            ? `${formatNumber(transactionTotal)} cuzdan hareketi`
            : 'Cuzdan API verisi'),
        tone: dashboardErrors.walletBalance ? 'neutral' : 'secondary',
        icon: 'account_balance_wallet',
        noteIcon: dashboardErrors.walletBalance ? 'error' : 'payments',
      },
    ]
  }, [
    dashboardData.tenders,
    dashboardData.walletBalance,
    dashboardData.walletTransactions,
    dashboardErrors.tenders,
    dashboardErrors.walletBalance,
    dashboardErrors.walletTransactions,
    isDashboardLoading,
    openTenders.length,
    tenders.length,
  ])

  const feedItems = useMemo(
    () =>
      tenders.slice(0, 4).map((tender) => [
        tender.title || 'Basliksiz ilan',
        tender.categoryName || tender.status || 'Ilan',
        isOpenTender(tender) ? 'secondary' : 'primary',
      ]),
    [tenders],
  )

  return (
    <div className="dashboard-page">
      <AppTopNavbar currentPath="/dashboard" navigate={navigate} />
      <AppSideNavbar
        currentPath="/dashboard"
        navigate={navigate}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <div>
              <h1>Hesap Ozeti</h1>
              <p>Aktif ilanlari ve cuzdan hareketlerini takip et.</p>
            </div>
          </header>

          <section className="dashboard-stats">
            {statsCards.map((card) => (
              <article key={card.label} className="dashboard-stat-card">
                <p>{card.label}</p>
                <h2>{card.value}</h2>
                <span className={`dashboard-stat-card__note dashboard-stat-card__note--${card.tone}`}>
                  <span className="material-symbols-outlined">{card.noteIcon}</span>
                  {card.note}
                </span>
                <span className="material-symbols-outlined dashboard-stat-card__bg-icon">
                  {card.icon}
                </span>
              </article>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-active">
              <div className="dashboard-section-head">
                <h3>{openTenders.length > 0 ? 'Acik Ilanlar' : 'Son Ilanlar'}</h3>
                <button type="button" onClick={navigate('/auctions')}>Tumunu Gor</button>
              </div>
              <div className="dashboard-active__list">
                {isDashboardLoading && visibleTenders.length === 0 ? (
                  <article className="dashboard-auction-card">
                    <div className="dashboard-auction-card__body">
                      <div className="dashboard-auction-card__title">
                        <h4>Yukleniyor...</h4>
                        <span className="dashboard-auction-card__status dashboard-auction-card__status--neutral">
                          API
                        </span>
                      </div>
                    </div>
                  </article>
                ) : null}

                {!isDashboardLoading && dashboardErrors.tenders ? (
                  <article className="dashboard-auction-card">
                    <div className="dashboard-auction-card__body">
                      <div className="dashboard-auction-card__title">
                        <h4>{dashboardErrors.tenders}</h4>
                        <span className="dashboard-auction-card__status dashboard-auction-card__status--tertiary">
                          Hata
                        </span>
                      </div>
                    </div>
                  </article>
                ) : null}

                {!isDashboardLoading &&
                !dashboardErrors.tenders &&
                visibleTenders.length === 0 ? (
                  <article className="dashboard-auction-card">
                    <div className="dashboard-auction-card__body">
                      <div className="dashboard-auction-card__title">
                        <h4>Gosterilecek ilan bulunamadi.</h4>
                        <span className="dashboard-auction-card__status dashboard-auction-card__status--neutral">
                          Bos
                        </span>
                      </div>
                    </div>
                  </article>
                ) : null}

                {visibleTenders.map((auction) => (
                  <article key={auction.id || auction.title} className="dashboard-auction-card">
                    <div className="dashboard-auction-card__media">
                      <img alt={auction.alt} src={auction.image} />
                    </div>
                    <div className="dashboard-auction-card__body">
                      <div className="dashboard-auction-card__title">
                        <h4>{auction.title}</h4>
                        <span className={`dashboard-auction-card__status dashboard-auction-card__status--${auction.tone}`}>
                          {auction.status}
                        </span>
                      </div>
                      <div className="dashboard-auction-card__meta">
                        <div><span>Baslangic Fiyati</span><strong>{auction.startingPrice}</strong></div>
                        <div className="dashboard-auction-card__meta-right"><span>Bitis</span><strong>{auction.endsAt}</strong></div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-history">
              <div className="dashboard-section-head">
                <h3>Teklif Gecmisi</h3>
              </div>
              <div className="dashboard-table-shell">
                <table className="dashboard-table">
                  <thead>
                    <tr><th>Tarih</th><th>Urun</th><th>Teklifin</th><th>Durum</th><th className="dashboard-table__right">Islem</th></tr>
                  </thead>
                  <tbody>
                    {bidHistory.map((row) => (
                      <tr key={`${row.date}-${row.item}`}>
                        <td>{row.date}</td>
                        <td><div className="dashboard-table__item"><div className="dashboard-table__thumb"><img alt="" src={row.image} /></div><span>{row.item}</span></div></td>
                        <td className="dashboard-table__bid">{row.bid}</td>
                        <td><span className={`dashboard-table__status dashboard-table__status--${row.tone}`}><span></span>{row.status}</span></td>
                        <td className="dashboard-table__right">
                          {row.action === 'rebid' ? (
                            <button className="dashboard-table__rebid" type="button">Statik</button>
                          ) : (
                            <button className="dashboard-table__open" type="button" aria-label="Muzayedeyi ac"><span className="material-symbols-outlined">open_in_new</span></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="dashboard-table__footer">
                  <p>Bid history API olmadigi icin statik ornekler gosteriliyor.</p>
                  <div className="dashboard-pagination">
                    <button type="button" aria-label="Onceki sayfa"><span className="material-symbols-outlined">chevron_left</span></button>
                    <button className="dashboard-pagination__active" type="button">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <button type="button" aria-label="Sonraki sayfa"><span className="material-symbols-outlined">chevron_right</span></button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="dashboard-feed">
            <div className="dashboard-feed__label"><span>Son Ilanlar</span><div></div></div>
            <div className="dashboard-feed__items">
              {feedItems.length > 0 ? (
                feedItems.map(([title, value, tone]) => (
                  <div key={`${title}-${value}`} className="dashboard-feed__item">
                    <span className="dashboard-feed__title">{title}</span>
                    <span className={`dashboard-feed__value dashboard-feed__value--${tone}`}>{value}</span>
                  </div>
                ))
              ) : (
                <div className="dashboard-feed__item">
                  <span className="dashboard-feed__title">
                    {isDashboardLoading ? 'Yukleniyor...' : 'Ilan verisi yok'}
                  </span>
                  <span className="dashboard-feed__value dashboard-feed__value--primary">API</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <nav className="dashboard-mobile-nav">
        <button type="button" onClick={navigate('/auctions')}><span className="material-symbols-outlined">gavel</span><span>Canli</span></button>
        <button className="dashboard-mobile-nav__active" type="button"><span className="material-symbols-outlined">dashboard</span><span>Panel</span></button>
        <a href="/auctions/create" onClick={navigate('/auctions/create')}><span className="material-symbols-outlined">add_circle</span><span>Sat</span></a>
        <a href="/wallet" onClick={navigate('/wallet')}><span className="material-symbols-outlined">account_balance_wallet</span><span>Cuzdan</span></a>
        <button type="button"><span className="material-symbols-outlined">person</span><span>Profil</span></button>
      </nav>
    </div>
  )
}

export default DashboardPage
