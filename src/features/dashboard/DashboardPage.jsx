import { useEffect, useMemo, useState } from 'react'
import './DashboardPage.css'
import { sendAuthorizedRequest } from '../../shared/api/authorizedRequest'
import { getApiErrorMessage } from '../../shared/api/apiError'
import { AppSideNavbar, AppTopNavbar } from '../../shared/components/navigation/AppNavigation'

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

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase()
}

function getField(source, ...keys) {
  if (!source || typeof source !== 'object') {
    return undefined
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key]
    }
  }

  return undefined
}

function isOpenTender(tender) {
  const normalizedStatus = normalizeStatus(tender.status)

  if (normalizedStatus) {
    return openTenderStatuses.has(normalizedStatus)
  }

  const endDate = getField(tender, 'endDate', 'end_date', 'endsAt', 'ends_at')

  if (!endDate) {
    return false
  }

  return new Date(endDate).getTime() > Date.now()
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

async function fetchDashboardSummary() {
  const { payload, response } = await sendAuthorizedRequest('/api/dashboard/summary')

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, 'Dashboard ozeti alinamadi.'))
  }

  return payload
}

function getErrorMessage(errors, ...keys) {
  const value = getField(errors, ...keys)

  if (!value) {
    return ''
  }

  return typeof value === 'string' ? value : 'Ozet verisinin bu bolumu alinamadi.'
}

function DashboardPage({ navigate, onLogout }) {
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardErrors, setDashboardErrors] = useState({})
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    async function loadDashboardData() {
      setIsDashboardLoading(true)
      setDashboardErrors({})

      try {
        const summary = await fetchDashboardSummary()

        if (!isCurrent) {
          return
        }

        setDashboardData(summary)
        setDashboardErrors(summary?.errors || {})
      } catch (error) {
        if (!isCurrent) {
          return
        }

        setDashboardData(null)
        setDashboardErrors({
          summary: error.message,
        })
      } finally {
        if (isCurrent) {
          setIsDashboardLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isCurrent = false
    }
  }, [])

  const wallet = dashboardData?.wallet || null
  const walletTransactions =
    getField(dashboardData, 'walletTransactions', 'wallet_transactions') || null
  const listings = useMemo(() => dashboardData?.listings || {}, [dashboardData?.listings])
  const stats = useMemo(() => dashboardData?.stats || {}, [dashboardData?.stats])
  const summaryError = dashboardErrors.summary || ''
  const listingsError = summaryError || getErrorMessage(dashboardErrors, 'listings', 'tenders')
  const walletError = summaryError || getErrorMessage(dashboardErrors, 'wallet')
  const transactionsError =
    summaryError || getErrorMessage(dashboardErrors, 'walletTransactions', 'wallet_transactions')
  const bidsError = summaryError || getErrorMessage(dashboardErrors, 'recentBids', 'recent_bids')

  const tenders = useMemo(
    () =>
      Array.isArray(dashboardData?.listings?.tenders)
        ? dashboardData.listings.tenders
        : [],
    [dashboardData?.listings],
  )

  const activeAuctions = useMemo(
    () =>
      Array.isArray(dashboardData?.activeAuctions)
        ? dashboardData.activeAuctions
        : Array.isArray(dashboardData?.active_auctions)
          ? dashboardData.active_auctions
        : [],
    [dashboardData?.activeAuctions, dashboardData?.active_auctions],
  )

  const openTenders = useMemo(
    () => tenders.filter((tender) => isOpenTender(tender)),
    [tenders],
  )

  const visibleTenders = useMemo(() => {
    const preferredTenders =
      activeAuctions.length > 0
        ? activeAuctions
        : openTenders.length > 0
          ? openTenders
          : tenders

    return preferredTenders.slice(0, 3).map((tender, index) => {
      const fallbackImage =
        fallbackAuctionImages[index % fallbackAuctionImages.length]
      const isAuction = activeAuctions.length > 0
      const displayPrice = getField(
        tender,
        'currentPrice',
        'current_price',
        'startingPrice',
        'starting_price',
        'startPrice',
        'start_price',
      )
      const endDate = getField(tender, 'endsAt', 'ends_at', 'endDate', 'end_date')

      return {
        id: tender.id,
        title: tender.title || 'Basliksiz ilan',
        status: tender.status || (isAuction ? 'Muzayede' : 'Ilan'),
        tone: isAuction || isOpenTender(tender) ? 'secondary' : 'neutral',
        priceLabel: isAuction ? 'Guncel Fiyat' : 'Baslangic Fiyati',
        displayPrice: formatCurrency(displayPrice),
        endsAt: formatEndDate(endDate),
        image: fallbackImage.image,
        alt: fallbackImage.alt,
      }
    })
  }, [activeAuctions, openTenders, tenders])

  const recentBids = useMemo(
    () =>
      Array.isArray(dashboardData?.recentBids)
        ? dashboardData.recentBids
        : Array.isArray(dashboardData?.recent_bids)
          ? dashboardData.recent_bids
        : [],
    [dashboardData?.recentBids, dashboardData?.recent_bids],
  )

  const bidRows = useMemo(
    () =>
      recentBids.map((bid, index) => {
        const fallbackImage =
          fallbackAuctionImages[index % fallbackAuctionImages.length]
        const isWinning = Boolean(getField(bid, 'isWinning', 'is_winning'))
        const status = bid.status || (isWinning ? 'Kazaniyor' : 'Teklif')

        return {
          id: bid.id || `${getField(bid, 'auctionId', 'auction_id')}-${index}`,
          date: formatEndDate(getField(bid, 'createdAt', 'created_at')),
          item: getField(bid, 'auctionTitle', 'auction_title') || 'Basliksiz muzayede',
          bid: formatCurrency(bid.amount),
          status,
          tone: isWinning || normalizeStatus(status) === 'accepted' ? 'secondary' : 'tertiary',
          image: fallbackImage.image,
        }
      }),
    [recentBids],
  )

  const statsCards = useMemo(() => {
    const tenderTotal =
      getField(stats, 'totalListings', 'total_listings') ??
      getField(listings, 'totalCount', 'total_count') ??
      tenders.length
    const activeAuctionTotal =
      getField(stats, 'activeAuctions', 'active_auctions') ?? activeAuctions.length
    const transactionTotal =
      getField(stats, 'walletTransactions', 'wallet_transactions') ??
      getField(walletTransactions, 'totalCount', 'total_count') ??
      walletTransactions?.transactions?.length
    const walletBalance = wallet?.balance

    return [
      {
        label: 'Toplam Ilan',
        value: isDashboardLoading && !dashboardData ? '...' : formatNumber(tenderTotal),
        note: listingsError || 'Ozet endpointi toplam sayisi',
        tone: listingsError ? 'neutral' : 'secondary',
        icon: 'inventory_2',
        noteIcon: listingsError ? 'error' : 'dns',
      },
      {
        label: 'Aktif Muzayede',
        value:
          isDashboardLoading && !dashboardData
            ? '...'
            : formatNumber(activeAuctionTotal),
        note:
          activeAuctions.length > 0
            ? 'Canli ozet verisi'
            : 'Ilanlardan yedekleniyor',
        tone: 'primary',
        icon: 'visibility',
        noteIcon: 'schedule',
      },
      {
        label: 'Cuzdan Bakiyesi',
        value:
          isDashboardLoading && !dashboardData
            ? '...'
            : formatCurrency(walletBalance),
        note:
          walletError ||
          transactionsError ||
          (Number.isFinite(Number(transactionTotal))
            ? `${formatNumber(transactionTotal)} cuzdan hareketi`
            : 'Ozet endpointi cuzdan verisi'),
        tone: walletError ? 'neutral' : 'secondary',
        icon: 'account_balance_wallet',
        noteIcon: walletError ? 'error' : 'payments',
      },
    ]
  }, [
    activeAuctions.length,
    dashboardData,
    isDashboardLoading,
    listingsError,
    listings,
    stats,
    tenders.length,
    transactionsError,
    wallet,
    walletError,
    walletTransactions,
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
                <h3>{activeAuctions.length > 0 ? 'Aktif Muzayedeler' : 'Son Ilanlar'}</h3>
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

                {!isDashboardLoading && listingsError ? (
                  <article className="dashboard-auction-card">
                    <div className="dashboard-auction-card__body">
                      <div className="dashboard-auction-card__title">
                        <h4>{listingsError}</h4>
                        <span className="dashboard-auction-card__status dashboard-auction-card__status--tertiary">
                          Hata
                        </span>
                      </div>
                    </div>
                  </article>
                ) : null}

                {!isDashboardLoading &&
                !listingsError &&
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
                        <div><span>{auction.priceLabel}</span><strong>{auction.displayPrice}</strong></div>
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
                    {isDashboardLoading && bidRows.length === 0 ? (
                      <tr>
                        <td colSpan="5">Yukleniyor...</td>
                      </tr>
                    ) : null}

                    {!isDashboardLoading && bidsError ? (
                      <tr>
                        <td colSpan="5">{bidsError}</td>
                      </tr>
                    ) : null}

                    {!isDashboardLoading && !bidsError && bidRows.length === 0 ? (
                      <tr>
                        <td colSpan="5">Teklif gecmisi bulunamadi.</td>
                      </tr>
                    ) : null}

                    {bidRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.date}</td>
                        <td><div className="dashboard-table__item"><div className="dashboard-table__thumb"><img alt="" src={row.image} /></div><span>{row.item}</span></div></td>
                        <td className="dashboard-table__bid">{row.bid}</td>
                        <td><span className={`dashboard-table__status dashboard-table__status--${row.tone}`}><span></span>{row.status}</span></td>
                        <td className="dashboard-table__right">
                          <button className="dashboard-table__open" type="button" aria-label="Muzayedeyi ac"><span className="material-symbols-outlined">open_in_new</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="dashboard-table__footer">
                  <p>
                    {isDashboardLoading
                      ? 'Teklifler yukleniyor.'
                      : bidsError || `${formatNumber(bidRows.length)} son teklif gosteriliyor.`}
                  </p>
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
