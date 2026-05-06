import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './LiveAuctionsPage.css'
import { AppSideNavbar, AppTopNavbar } from '../../../shared/components/navigation/AppNavigation'
import {
  getApiErrorMessage,
  getUserFacingErrorMessage,
} from '../../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'
import { normalizeCategoryTree } from '../create/categoryOptions'

const imageFallbacks = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBj8KFbP6P_e_F-eKJJN0yxsB3gtrT06H9IX1BosthXFCHeq0dFdgaZrUTKZydbDXPF24Qsir99du0nYRfdpGFTxQEqLgh5NX2v6A-B5lJPDA6x0O1ppBw3pYJ1E17i99GdPzdCtlh0r6i3q_TgccUql40i84-bPRz0GdGgKf0sYECjPcDVHlbcI0rW9FUWw8Ms0EQd2wvwxmajQEX7UEVi3Tf2ZwMQECpDqErL0Fr7f5cyUm9tP6A1OCTSnaQEHMGf3ZA1pLL7ma4',
    alt: 'Premium eski film kamerası yakın plan',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsHzSaWZ0OXBlXmW_7Ha-tVCmjujcrqkhRso8ovrJ2zB7CMMoNsseTyFdjNuHKQx6hMV732c-qQwEUS08vb-DsVSDoKPTfjd1NdO9WFbi5K3tiRPFC9bayoBg1mA4nvb7Eb5zJPGyUudeJ-a5voz4E0T-UFJ1DAmdkh_4B8nowfpmsp4hK1jAOPkwXTh7iaFvFcifxGbcx11UUb1SCv2z8wLm1nB9cztiTnv421B3G3cbpiG9avq-DNWbcjk_isEJ07oac3JhyXnI',
    alt: 'RGB aydınlatmalı özel mekanik klavye',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQ0RpmYnG1Y3o1gNWD_szQmQWy2-FAs58JeRiZ2cWt7gnQA9xMx6ot5IgBUY7FVkAxAj32dCIJJbPrA71auYYDZKLs6aeIDZkj1fRuGXqZkc--h2IjTCvMVvs2FqZGOq4zVmwA29rPfZvD02SlVtAqvT1OPnRw6gde_KrTFboMibFCfsU-QmGLF33DAa0m06SdKgkDZUNQ2QiUOlzpWkMc0GKwloKmwR3ugaTipFTVBRcf3jis9LyJ7hfEhIj2h8zlIF7pr-mAuU',
    alt: 'Ses arabirimi üzerinde profesyonel stüdyo kulaklığı',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDNXwBOc4ojx8HqKSdYr_5tIw_mlCGmkAzyvrgQK_KVWLSjGg2z2a5QJ0U-MqPMzYYsOKsMNYwkeWo--5h_shiDe3YYZHYCzegr9Py-CViSm3Sm3itisnpKIZLXFHsaDi74hvc7rfRuO59hOFNqGc73z7zluiNtXsUb-9Q6ALSC-SPckrmOuwFlX4ruhm3WGwzoeKekH_qQApUHcGMt-oEzGiCAdK4r6P8PjE9Xi84ISSyUdcOhwHI2VxaK-UvDHiKggnhs2JJUuY',
    alt: 'Lüks saat mekanizması makro detayı',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA238dzWrTBBTGSS6pyGgVkyOq440JGLxTuHW_MnNhgMrF5t6iDdb1i76iiG7F-FnmBGDR1lp0o1gpN7LND-5oJHBLzhJfhe_EIZUY8h5JKKFryW6gi4nf17WeV7FPevgwVLu0i3qESr5W236Tuum4sBJZvZ6fURkGo72oUIp2xlebm_2YNVD9ogak2X3L0h-MeJLWtm9dB27g4nXLDrEnqWmAC9I-JsPwtiFilVZGnU3_gZ0Ai8x5Ku3NB7JFkQd7KRJnprP-W76s',
    alt: 'Patch kablolu modüler synthesizer',
  },
]

const moneyFormatter = new Intl.NumberFormat('tr-TR', {
  currency: 'TRY',
  style: 'currency',
})

function readField(source, ...keys) {
  return keys.map((key) => source?.[key]).find((value) => value !== undefined)
}

function readCollection(payload, ...keys) {
  if (Array.isArray(payload)) {
    return payload
  }

  for (const key of keys) {
    const value = payload?.[key]

    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}

function buildAuctionListPath() {
  return '/api/auction/active?pageNumber=1&pageSize=20'
}

function toNumber(value) {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : 0
}

function formatMoney(value) {
  return moneyFormatter.format(toNumber(value))
}

function formatEndsAt(value) {
  const endDate = new Date(value)

  if (Number.isNaN(endDate.getTime())) {
    return 'Tarih yok'
  }

  const diffMs = endDate.getTime() - Date.now()

  if (diffMs <= 0) {
    return 'Bitti'
  }

  const totalMinutes = Math.floor(diffMs / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days}g ${hours}s`
  }

  if (hours > 0) {
    return `${hours}s ${minutes}dk`
  }

  return `${minutes}dk`
}

function readImageUrl(auction) {
  const imageUrls = readField(auction, 'imgUrls', 'ImgUrls', 'imageUrls', 'ImageUrls')

  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    return imageUrls[0]
  }

  return readField(auction, 'imageUrl', 'ImageUrl', 'image_url')
}

function matchesAuctionFilters(auction, searchQuery, categoryId) {
  const categoryValue = readField(auction, 'categoryId', 'CategoryId')
  const normalizedCategoryId = String(categoryId || '')

  if (normalizedCategoryId && String(categoryValue || '') !== normalizedCategoryId) {
    return false
  }

  const normalizedSearch = searchQuery.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  return [
    readField(auction, 'auctionName', 'AuctionName', 'title', 'Title'),
    readField(auction, 'description', 'Description'),
    readField(auction, 'rules', 'Rules'),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedSearch))
}

function normalizeAuction(auction, index) {
  const fallback = imageFallbacks[index % imageFallbacks.length]
  const id = readField(auction, 'id', 'Id', 'auctionId', 'AuctionId')
  const currentPrice = readField(
    auction,
    'current_price',
    'currentPrice',
    'CurrentPrice',
    'highestBid',
    'HighestBid',
  )
  const endTime = readField(auction, 'ends_at', 'endsAt', 'EndsAt', 'endDate', 'EndDate')
  const title =
    readField(auction, 'auctionName', 'AuctionName', 'title', 'Title') || 'İsimsiz müzayede'
  const endsLabel = formatEndsAt(endTime)
  const imageUrl = readImageUrl(auction)
  const startingPrice = readField(
    auction,
    'startingPrice',
    'StartingPrice',
    'start_price',
    'startPrice',
    'StartPrice',
  )

  return {
    id,
    key: String(id || `${title}-${index}`),
    alt: title || fallback.alt,
    description:
      readField(auction, 'description', 'Description') || 'Açıklama henüz eklenmedi.',
    endsAt: endTime,
    endsIn: endsLabel,
    image: imageUrl || fallback.image,
    price: formatMoney(currentPrice ?? startingPrice),
    title,
    urgency: endsLabel !== 'Bitti' && new Date(endTime).getTime() - Date.now() < 60 * 60 * 1000,
  }
}

function AuctionCard({ card, navigate }) {
  const detailPath = `/auctions/${card.id}`
  const cardContent = (
    <>
      <div className="auction-card__media">
        <img alt={card.alt} src={card.image} />
      </div>

      <div className="auction-card__body">
        <h3>{card.title}</h3>
        <p>{card.description}</p>

        <div className="auction-card__meta">
          <div>
            <span>Güncel</span>
            <strong>{card.price}</strong>
          </div>

          <div className="auction-card__meta-right">
            <span className={card.urgency ? 'auction-card__urgent' : ''}>
              Kalan süre
            </span>
            <strong>{card.endsIn}</strong>
          </div>
        </div>
      </div>
    </>
  )

  if (!card.id) {
    return <article className="auction-card">{cardContent}</article>
  }

  return (
    <a className="auction-card" href={detailPath} onClick={navigate(detailPath)}>
      {cardContent}
    </a>
  )
}

function SkeletonCard() {
  return (
    <article className="auction-skeleton" aria-hidden="true">
      <div className="auction-skeleton__media"></div>
      <div className="auction-skeleton__body">
        <span className="auction-skeleton__line auction-skeleton__line--title"></span>
        <span className="auction-skeleton__line auction-skeleton__line--subtitle"></span>
        <div className="auction-skeleton__footer">
          <div>
            <span className="auction-skeleton__line auction-skeleton__line--label"></span>
            <span className="auction-skeleton__line auction-skeleton__line--value"></span>
          </div>
          <div className="auction-skeleton__footer-right">
            <span className="auction-skeleton__line auction-skeleton__line--label"></span>
            <span className="auction-skeleton__line auction-skeleton__line--value"></span>
          </div>
        </div>
      </div>
    </article>
  )
}

function LiveAuctionsPage({ navigate, onLogout }) {
  const location = useLocation()
  const [auctions, setAuctions] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryError, setCategoryError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [auctionError, setAuctionError] = useState('')
  const searchQuery = useMemo(() => {
    const query = new URLSearchParams(location.search).get('search') || ''

    return query.trim()
  }, [location.search])
  const selectedCategoryId = useMemo(
    () => new URLSearchParams(location.search).get('categoryId') || '',
    [location.search],
  )

  useEffect(() => {
    let isCurrent = true

    async function loadCategories() {
      setCategoryError('')

      try {
        const { payload, response } = await sendAuthorizedRequest('/api/categories')

        if (!response.ok) {
          throw new Error(getApiErrorMessage(payload, 'Kategoriler yüklenemedi.'))
        }

        if (isCurrent) {
          setCategories(normalizeCategoryTree(payload))
        }
      } catch (error) {
        if (isCurrent) {
          setCategoryError(
            getUserFacingErrorMessage(error, 'Kategoriler yüklenemedi.'),
          )
        }
      }
    }

    loadCategories()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    async function loadAuctions() {
      setIsLoading(true)
      setAuctionError('')

      try {
        const auctionsPath = buildAuctionListPath()
        const { payload, response } = await sendAuthorizedRequest(auctionsPath)

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              searchQuery
                ? 'Arama sonuçları yüklenemedi. Lütfen tekrar dene.'
                : 'Müzayedeler yüklenemedi. Lütfen tekrar dene.',
            ),
          )
        }

        if (isCurrent) {
          const nextAuctions = readCollection(
            payload,
            'auctions',
            'Auctions',
            'activeAuctions',
            'ActiveAuctions',
            'items',
            'Items',
            'data',
            'Data',
          ).filter((auction) =>
            matchesAuctionFilters(auction, searchQuery, selectedCategoryId),
          )

          setAuctions(nextAuctions)
        }
      } catch (error) {
        if (isCurrent) {
          setAuctionError(
            getUserFacingErrorMessage(error, 'Müzayedeler yüklenemedi.'),
          )
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadAuctions()

    return () => {
      isCurrent = false
    }
  }, [searchQuery, selectedCategoryId])

  const renderedAuctions = useMemo(
    () => auctions.map((auction, index) => normalizeAuction(auction, index)),
    [auctions],
  )
  const categoryFilters = useMemo(
    () => [
      {
        id: '',
        label: 'Kategori seç',
      },
      ...categories.map((category) => ({
        id: category.id,
        label: category.name,
      })),
    ],
    [categories],
  )
  const featuredAuction = renderedAuctions[0]
  const cardAuctions = renderedAuctions.slice(1)
  const emptyMessage = searchQuery
    ? `"${searchQuery}" için sonuç bulunamadı.`
    : 'Henüz yayında müzayede yok.'

  const handleCategoryFilter = (categoryId) => {
    const params = new URLSearchParams()

    if (searchQuery) {
      params.set('search', searchQuery)
    }

    if (categoryId) {
      params.set('categoryId', categoryId)
    }

    const nextPath = params.toString()
      ? `/auctions?${params.toString()}`
      : '/auctions'

    navigate(nextPath)()
  }

  const handleCategoryFilterChange = (event) => {
    handleCategoryFilter(event.target.value)
  }

  return (
    <div className="auctions-page">
      <AppTopNavbar
        currentPath="/auctions"
        navigate={navigate}
        searchValue={searchQuery}
      />

      <div className="auctions-shell">
        <AppSideNavbar
          currentPath="/auctions"
          navigate={navigate}
          onLogout={onLogout}
        />

        <main className="auctions-main">
          <div className="auctions-main__header">
            <div>
              <h1>Canlı müzayedeler</h1>
              <p>
                {searchQuery
                  ? `"${searchQuery}" arama sonuçları.`
                  : 'Seçkin koleksiyonerler için küratörlü dijital ve fiziksel varlıklar.'}
              </p>
            </div>

            <div className="auctions-filters">
              <select
                aria-label="Kategori filtresi"
                className="auction-category-select"
                value={selectedCategoryId}
                onChange={handleCategoryFilterChange}
              >
                {categoryFilters.map((filter) => (
                  <option key={filter.id || 'all'} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
              {categoryError ? (
                <span className="auction-filter-error">{categoryError}</span>
              ) : null}
            </div>
          </div>

          {auctionError ? (
            <div className="auction-state" role="alert">
              {auctionError}
            </div>
          ) : null}

          <section className="auction-grid" aria-label="Müzayede listesi">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : null}

            {!isLoading && !auctionError && renderedAuctions.length === 0 ? (
              <div className="auction-state">{emptyMessage}</div>
            ) : null}

            {!isLoading && featuredAuction ? (
              <article className="auction-feature">
                <div className="auction-feature__media">
                  <img alt={featuredAuction.alt} src={featuredAuction.image} />

                  <div className="auction-feature__badges">
                    <span className="auction-badge auction-badge--timer">
                      {featuredAuction.endsIn} kaldı
                    </span>
                  </div>
                </div>

                <div className="auction-feature__panel">
                  <div className="auction-feature__header">
                    <div>
                      <h2>{featuredAuction.title}</h2>
                      <p>{featuredAuction.description}</p>
                    </div>

                    <div className="auction-feature__price">
                      <span>Güncel teklif</span>
                      <strong>{featuredAuction.price}</strong>
                    </div>
                  </div>

                  <div className="auction-feature__footer">
                    <div className="auction-feature__avatars" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span>+12</span>
                    </div>

                    {featuredAuction.id ? (
                      <a
                        className="auction-feature__button"
                        href={`/auctions/${featuredAuction.id}`}
                        onClick={navigate(`/auctions/${featuredAuction.id}`)}
                      >
                        Teklif Ver
                      </a>
                    ) : (
                      <button className="auction-feature__button" disabled type="button">
                        Teklif Ver
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ) : null}

            {!isLoading
              ? cardAuctions.map((card) => (
                  <AuctionCard card={card} key={card.key} navigate={navigate} />
                ))
              : null}
          </section>
        </main>
      </div>

      <nav className="auctions-mobile-dock" aria-label="Mobil navigasyon">
        <button className="auctions-mobile-dock__item auctions-mobile-dock__item--active" type="button">
          <span className="material-symbols-outlined">gavel</span>
          <span>Canlı</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Panel</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">category</span>
          <span>Ürünler</span>
        </button>
        <a className="auctions-mobile-dock__item" href="/wallet" onClick={navigate('/wallet')}>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>Cüzdan</span>
        </a>
      </nav>
    </div>
  )
}

export default LiveAuctionsPage
