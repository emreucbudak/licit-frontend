import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import './LotDetailPage.css'
import { AppTopNavbar } from '../../../shared/components/navigation/AppNavigation'
import { getApiErrorMessage } from '../../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'
import { getStoredAuthTokens } from '../../../shared/auth/authStorage'

const galleryImages = [
  {
    alt: 'Luxury watch mechanism macro detail',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFFGG9hhajC-rn79MlByaDR2cuCxjVf4EyQadtyc4MydPYC59vVd858s58Z6JRG8cnq1uClvHfG9e1Txy6N5nyUfmk9U8B4Kar_H9c0_CVuEpmhi7LXyvjZncNbLyWQ959TJsyc_8zbCQ5F1I-SWoqb9XdDIrnp1T9VabtzW_GFOaDcuypime8kGM_vajQRANGKfHlsM-ThD_XqFBIN-ksJpl6lUdbi5wh0cGEUw1UcY6q_Irt92Urg3LziZ6OllISchoCgI2e62E',
    active: true,
  },
  {
    alt: 'Luxury watch side view',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWFKxrcgY7qzycVAyMrZ7RQpbUlx_okF4AeHPHaHa3Q4KCUBC34B3B1XW0LyrVJufaWa0vbiN-udz18P444-BBNoUxKsmmxXLtBvKDng87BJhAtVzi627UKW9Z8C-5rSsK-I3M40-xt6M0ORKqqi9csI0vMHvRYp1MCLMXXG6vqsThzRWse5l5z3cauMVmJV_6OIkdYKcd-a2EDswH4RWIBM3c7aDTh7e-OTd4Xdqe-Fdpx2PMpd37kCXLppVqS_mrhFczaaxeBu4',
  },
  {
    alt: 'Watch worn in evening light',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLyTHRXUyoE2RoKJhqSE-M3hmzMLUgDeX_LGT3x-Ixw3zIEwrHz1JSKMgchPnzbdIrM2dn9R8X-lwkGUAPqgg8FgoGf3vkMTgX706fkdO5nYfXpF2U4hVHQxpHbYKBWOBA-OhOd3bxLKDhKi2yRJED3S5eFgc7M_AwV46DVbk_sX6BnWsFlLCdl18Ez7qgPTbS9KbZnc9wuFYfsC2Xp-EsknEpw6O4bJrROyLPq_gIHdVuBUJ_Wa1T0uKP6qd1gQw7cgUpbGzuYrM',
  },
  {
    alt: 'Luxury presentation box',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwe4ew3SmRrMIlPIVGIgQOwqa6yUx5_wLq4BhhdsQei9M4OD5eyALdsB7c_5vTyBBJrXtN2jMNOEcQYW5yUqqjDB73EygRFdEsvAWghvl8rsWY0ZS6L-PEtx8osDg0Q37fvezuGSag4InSCuq433HZ0P9chJSSwVMTfbwB-aES5Vc_6F_SAIGt_bM_Yg05GBejzqnQ_deIGNSay9bv3WAeLLIKYqn4TcmlGp9e8WoP0vXC2eRj4i4Tj2WhbBE3UhcYVPwel3CmaMc',
    extraCount: '+8',
  },
]

const quickInfo = [
  {
    icon: 'verified_user',
    title: 'Guvenli Teklif',
    body: 'Tum lotlarda emanet korumasi aktif.',
  },
  {
    icon: 'local_shipping',
    title: 'Global Ekspres',
    body: '5 gun icinde ozel teslimat.',
  },
]

const moneyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  year: 'numeric',
})

function readField(source, ...keys) {
  return keys.map((key) => source?.[key]).find((value) => value !== undefined)
}

function toNumber(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function formatMoney(value) {
  return moneyFormatter.format(toNumber(value))
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : dateTimeFormatter.format(date)
}

function formatCountdown(value) {
  const endDate = new Date(value)

  if (Number.isNaN(endDate.getTime())) {
    return '-'
  }

  const diffMs = endDate.getTime() - Date.now()

  if (diffMs <= 0) {
    return 'Bitti'
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

function formatRelativeTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000))

  if (diffMinutes < 1) {
    return 'Az once'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}dk once`
  }

  return formatDate(value)
}

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    const base64 = payload.replaceAll('-', '+').replaceAll('_', '/')
    const json = window.atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='))

    return JSON.parse(json)
  } catch {
    return null
  }
}

function readCurrentUserIdFromToken() {
  const { accessToken } = getStoredAuthTokens()
  const payload = accessToken ? decodeJwtPayload(accessToken) : null

  return (
    payload?.sub ||
    payload?.user_id ||
    payload?.userId ||
    payload?.nameid ||
    payload?.[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ] ||
    ''
  )
}

function createIdempotencyKey() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  const bytes = new Uint8Array(16)
  window.crypto?.getRandomValues?.(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return [...bytes]
    .map((byte, index) => {
      const value = byte.toString(16).padStart(2, '0')
      return [4, 6, 8, 10].includes(index) ? `-${value}` : value
    })
    .join('')
}

async function loadCurrentUserId() {
  try {
    const { payload, response } = await sendAuthorizedRequest('/api/auth/me')

    if (response.ok) {
      return (
        readField(payload, 'id', 'Id', 'user_id', 'userId', 'UserId', 'sub') ||
        readCurrentUserIdFromToken()
      )
    }
  } catch {
    // The bid request can still use an id from the access token if /me is unavailable.
  }

  return readCurrentUserIdFromToken()
}

function normalizeAuction(payload) {
  const auction = payload?.auction || payload?.Auction || payload

  return {
    currentPrice: toNumber(readField(auction, 'current_price', 'currentPrice', 'CurrentPrice')),
    description:
      readField(auction, 'description', 'Description') || 'Aciklama henuz eklenmedi.',
    endsAt: readField(auction, 'ends_at', 'endsAt', 'EndsAt'),
    id: readField(auction, 'id', 'Id'),
    minIncrement: toNumber(readField(auction, 'min_increment', 'minIncrement', 'MinIncrement')),
    startPrice: toNumber(readField(auction, 'start_price', 'startPrice', 'StartPrice')),
    status: readField(auction, 'status', 'Status') || 'unknown',
    title: readField(auction, 'title', 'Title') || 'Isimsiz muzayede',
  }
}

function normalizeBid(bid) {
  const userId = readField(bid, 'user_id', 'userId', 'UserId') || 'Kullanici'

  return {
    amount: toNumber(readField(bid, 'amount', 'Amount')),
    createdAt: readField(bid, 'created_at', 'createdAt', 'CreatedAt'),
    id: readField(bid, 'id', 'Id'),
    initials: String(userId).slice(0, 2).toUpperCase(),
    status: readField(bid, 'status', 'Status') || '',
    user: String(userId),
  }
}

function LotDetailPage({ navigate }) {
  const { auctionId } = useParams()
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [bidAmount, setBidAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingBid, setIsSubmittingBid] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [bidError, setBidError] = useState('')

  const loadAuction = useCallback(async () => {
    if (!auctionId) {
      return
    }

    setLoadError('')

    const [auctionResult, bidsResult] = await Promise.all([
      sendAuthorizedRequest(`/api/v1/auctions/${auctionId}`),
      sendAuthorizedRequest(`/api/v1/auctions/${auctionId}/bids`),
    ])

    if (!auctionResult.response.ok) {
      throw new Error(
        getApiErrorMessage(auctionResult.payload, 'Muzayede detayi alinamadi.'),
      )
    }

    if (!bidsResult.response.ok) {
      throw new Error(
        getApiErrorMessage(bidsResult.payload, 'Teklif gecmisi alinamadi.'),
      )
    }

    setAuction(normalizeAuction(auctionResult.payload))
    setBids(Array.isArray(bidsResult.payload) ? bidsResult.payload.map(normalizeBid) : [])
  }, [auctionId])

  useEffect(() => {
    let isCurrent = true

    async function loadInitialAuction() {
      setIsLoading(true)
      setLoadError('')
      setBidError('')
      setBidMessage('')

      try {
        await loadAuction()
      } catch (error) {
        if (isCurrent) {
          setLoadError(error?.message || 'Muzayede detayi yuklenemedi.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadInitialAuction()

    return () => {
      isCurrent = false
    }
  }, [loadAuction])

  const minimumBid = useMemo(() => {
    if (!auction) {
      return 0
    }

    return auction.currentPrice + auction.minIncrement
  }, [auction])

  useEffect(() => {
    if (auction) {
      setBidAmount(minimumBid.toFixed(2))
    }
  }, [auction, minimumBid])

  const renderedBids = useMemo(
    () => [...bids].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt)),
    [bids],
  )

  async function handleBidSubmit() {
    const amount = Number(bidAmount)

    setBidError('')
    setBidMessage('')

    if (!Number.isFinite(amount) || amount < minimumBid) {
      setBidError(`Teklif en az ${formatMoney(minimumBid)} olmali.`)
      return
    }

    setIsSubmittingBid(true)

    try {
      const userId = await loadCurrentUserId()
      const idempotencyKey = createIdempotencyKey()
      const { payload, response } = await sendAuthorizedRequest(
        `/api/v1/auctions/${auctionId}/bids`,
        {
          body: {
            amount,
            auction_id: auctionId,
            idempotency_key: idempotencyKey,
          },
          headers: {
            'Idempotency-Key': idempotencyKey,
            ...(userId ? { 'X-User-ID': userId } : {}),
          },
          method: 'POST',
        },
      )

      if (!response.ok) {
        throw new Error(getApiErrorMessage(payload, 'Teklif verilemedi.'))
      }

      setBidMessage('Teklif basariyla verildi.')
      await loadAuction()
    } catch (error) {
      setBidError(error?.message || 'Teklif verilemedi. Lutfen tekrar dene.')
    } finally {
      setIsSubmittingBid(false)
    }
  }

  const auctionStatus = String(auction?.status || '').toLowerCase()
  const canBid = auction && auctionStatus !== 'ended' && auctionStatus !== 'closed'

  return (
    <div className="lot-page">
      {bidMessage || bidError ? (
        <div
          className={`lot-toast${bidError ? ' lot-toast--error' : ''}`}
          role="status"
          aria-live="polite"
        >
          <span className="material-symbols-outlined lot-toast__icon">
            {bidError ? 'error' : 'check_circle'}
          </span>
          <span>{bidError || bidMessage}</span>
        </div>
      ) : null}

      <AppTopNavbar
        currentPath={`/auctions/${auctionId}`}
        navigate={navigate}
        searchPlaceholder="Lot ara..."
      />

      <main className="lot-layout">
        <section className="lot-gallery">
          <div className="lot-hero-media">
            <img
              alt="Rare skeleton mechanical watch studio close-up"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzqEMjOzvk6k5bT9kYm-Oukhhdq93JHRogJSjfE6rvpSJWZhqVINqDSKQ3hvIvdJsFQ7pItF3bykAfaJNrUAdvM6oPdUrKJKLIl-Q8QUKiizT75lqTazAne0JmQrz93_M5-RXfSLZcD6YwpEAyUpgGen7L-9b08EGam-r1wceiXjKQdCo-bhyKk_zLPOi9-uLLLtUhb4dp1elM1y37wktDAgVp31Ho4W_sF4Z0UNJFAim7reLX0-CuE0o-40YUMh0wVVW2YE050zw"
            />

          </div>

          <div className="lot-thumb-grid">
            {galleryImages.map((image) => (
              <button
                key={image.src}
                className={`lot-thumb${image.active ? ' lot-thumb--active' : ''}`}
                type="button"
              >
                <img alt={image.alt} src={image.src} />
                {image.extraCount ? (
                  <span className="lot-thumb__overlay">{image.extraCount}</span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="lot-meta-card">
            {isLoading ? (
              <p>Muzayede detayi yukleniyor...</p>
            ) : loadError ? (
              <p className="lot-error-text">{loadError}</p>
            ) : (
              <>
                <h1>{auction.title}</h1>
                <p>{auction.description}</p>

                <div className="lot-meta-card__facts">
                  <div className="lot-chip">
                    <span className="lot-chip__label">Bitis</span>
                    <span className="lot-chip__value">{formatDate(auction.endsAt)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="lot-sidebar">
          <div className="lot-bid-card">
            <div className="lot-bid-card__glow" aria-hidden="true"></div>

            <div className="lot-bid-card__header">
              <div>
                <span className="lot-bid-card__eyebrow">Guncel En Yuksek Teklif</span>
                <strong>{auction ? formatMoney(auction.currentPrice) : '-'}</strong>
              </div>

              <div className="lot-bid-card__countdown">
                <span>Kalan Sure</span>
                <strong>{auction ? formatCountdown(auction.endsAt) : '-'}</strong>
              </div>
            </div>

            <div className="lot-bid-card__controls">
              <label className="lot-bid-input" aria-label="Teklif tutari">
                <span>$</span>
                <input
                  disabled={!canBid || isSubmittingBid || isLoading}
                  min={minimumBid}
                  onChange={(event) => setBidAmount(event.target.value)}
                  step="0.01"
                  type="number"
                  value={bidAmount}
                />
              </label>

              <button
                className="lot-bid-button"
                disabled={!canBid || isSubmittingBid || isLoading}
                onClick={handleBidSubmit}
                type="button"
              >
                {isSubmittingBid ? 'Gonderiliyor' : 'Teklif Ver'}
              </button>

              <p>
                Onde olmak icin {formatMoney(minimumBid)} veya daha fazlasini gir.
              </p>
            </div>
          </div>

          <div className="lot-activity-card">
            <div className="lot-activity-card__header">
              <h2>Gercek Zamanli Aktivite</h2>
              <span className="lot-activity-card__online">
                <span></span>
                {renderedBids.length} Teklif
              </span>
            </div>

            <div className="lot-activity-feed">
              {isLoading ? <p className="lot-feed-state">Teklifler yukleniyor...</p> : null}
              {!isLoading && renderedBids.length === 0 ? (
                <p className="lot-feed-state">Henuz teklif yok.</p>
              ) : null}

              {!isLoading
                ? renderedBids.map((item, index) => (
                    <div
                      key={item.id || `${item.user}-${item.createdAt}`}
                      className={`lot-activity-item${index === 0 ? ' lot-activity-item--current' : ''}`}
                    >
                      <div
                        className={`lot-activity-item__avatar${
                          index === 0 ? ' lot-activity-item__avatar--current' : ''
                        }`}
                      >
                        {item.initials}
                      </div>

                      <div className="lot-activity-item__body">
                        <div className="lot-activity-item__meta">
                          <span
                            className={`lot-activity-item__user${
                              index === 0 ? ' lot-activity-item__user--current' : ''
                            }`}
                          >
                            {item.user}
                          </span>
                          <span className="lot-activity-item__time">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>

                        <p>
                          Teklif verdi: <strong>{formatMoney(item.amount)}</strong>
                          {item.status ? ` (${item.status})` : ''}
                        </p>
                      </div>

                      {index === 0 ? (
                        <span className="material-symbols-outlined lot-activity-item__check">
                          check_circle
                        </span>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>

          </div>

          <div className="lot-info-grid">
            {quickInfo.map((item) => (
              <article key={item.title} className="lot-info-card">
                <span className="material-symbols-outlined">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </aside>
      </main>

      <div className="lot-ticker">
        <div className="lot-ticker__content">
          <div className="lot-ticker__watchers">
            <div className="lot-ticker__avatars" aria-hidden="true">
              <span></span>
              <span></span>
              <span>+12</span>
            </div>
            <span>Bu lotu izleyen kullanicilar</span>
          </div>

          <div className="lot-ticker__actions">
            <div className="lot-ticker__divider"></div>
            <div>
              <span className="lot-ticker__label">Son Teklif</span>
              <strong>{auction ? formatMoney(auction.currentPrice) : '-'}</strong>
            </div>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Yukari Cik
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LotDetailPage
