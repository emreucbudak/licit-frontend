import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './LiveAuctionsPage.css'
import { AppSideNavbar, AppTopNavbar } from '../../../shared/components/navigation/AppNavigation'
import { getApiErrorMessage } from '../../../shared/api/apiError'
import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'

const categoryFilters = ['Tumu', 'Teknoloji', 'Sanat', 'Ev']

const imageFallbacks = [
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBj8KFbP6P_e_F-eKJJN0yxsB3gtrT06H9IX1BosthXFCHeq0dFdgaZrUTKZydbDXPF24Qsir99du0nYRfdpGFTxQEqLgh5NX2v6A-B5lJPDA6x0O1ppBw3pYJ1E17i99GdPzdCtlh0r6i3q_TgccUql40i84-bPRz0GdGgKf0sYECjPcDVHlbcI0rW9FUWw8Ms0EQd2wvwxmajQEX7UEVi3Tf2ZwMQECpDqErL0Fr7f5cyUm9tP6A1OCTSnaQEHMGf3ZA1pLL7ma4',
    alt: 'Premium vintage film camera close-up',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsHzSaWZ0OXBlXmW_7Ha-tVCmjujcrqkhRso8ovrJ2zB7CMMoNsseTyFdjNuHKQx6hMV732c-qQwEUS08vb-DsVSDoKPTfjd1NdO9WFbi5K3tiRPFC9bayoBg1mA4nvb7Eb5zJPGyUudeJ-a5voz4E0T-UFJ1DAmdkh_4B8nowfpmsp4hK1jAOPkwXTh7iaFvFcifxGbcx11UUb1SCv2z8wLm1nB9cztiTnv421B3G3cbpiG9avq-DNWbcjk_isEJ07oac3JhyXnI',
    alt: 'Custom mechanical keyboard with RGB lighting',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQ0RpmYnG1Y3o1gNWD_szQmQWy2-FAs58JeRiZ2cWt7gnQA9xMx6ot5IgBUY7FVkAxAj32dCIJJbPrA71auYYDZKLs6aeIDZkj1fRuGXqZkc--h2IjTCvMVvs2FqZGOq4zVmwA29rPfZvD02SlVtAqvT1OPnRw6gde_KrTFboMibFCfsU-QmGLF33DAa0m06SdKgkDZUNQ2QiUOlzpWkMc0GKwloKmwR3ugaTipFTVBRcf3jis9LyJ7hfEhIj2h8zlIF7pr-mAuU',
    alt: 'Professional studio headphones on an audio interface',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDNXwBOc4ojx8HqKSdYr_5tIw_mlCGmkAzyvrgQK_KVWLSjGg2z2a5QJ0U-MqPMzYYsOKsMNYwkeWo--5h_shiDe3YYZHYCzegr9Py-CViSm3Sm3itisnpKIZLXFHsaDi74hvc7rfRuO59hOFNqGc73z7zluiNtXsUb-9Q6ALSC-SPckrmOuwFlX4ruhm3WGwzoeKekH_qQApUHcGMt-oEzGiCAdK4r6P8PjE9Xi84ISSyUdcOhwHI2VxaK-UvDHiKggnhs2JJUuY',
    alt: 'Luxury watch mechanism macro detail',
  },
  {
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA238dzWrTBBTGSS6pyGgVkyOq440JGLxTuHW_MnNhgMrF5t6iDdb1i76iiG7F-FnmBGDR1lp0o1gpN7LND-5oJHBLzhJfhe_EIZUY8h5JKKFryW6gi4nf17WeV7FPevgwVLu0i3qESr5W236Tuum4sBJZvZ6fURkGo72oUIp2xlebm_2YNVD9ogak2X3L0h-MeJLWtm9dB27g4nXLDrEnqWmAC9I-JsPwtiFilVZGnU3_gZ0Ai8x5Ku3NB7JFkQd7KRJnprP-W76s',
    alt: 'Modular synthesizer with patch cables',
  },
]

const moneyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
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

function normalizeAuction(auction, index) {
  const fallback = imageFallbacks[index % imageFallbacks.length]
  const id = readField(auction, 'id', 'Id')
  const currentPrice = readField(auction, 'current_price', 'currentPrice', 'CurrentPrice')
  const endTime = readField(auction, 'ends_at', 'endsAt', 'EndsAt', 'endDate', 'EndDate')
  const title = readField(auction, 'title', 'Title') || 'Isimsiz muzayede'
  const endsLabel = formatEndsAt(endTime)
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
    alt: fallback.alt,
    description:
      readField(auction, 'description', 'Description') || 'Aciklama henuz eklenmedi.',
    endsAt: endTime,
    endsIn: endsLabel,
    image: fallback.image,
    price: formatMoney(currentPrice ?? startingPrice),
    title,
    urgency: endsLabel !== 'Bitti' && new Date(endTime).getTime() - Date.now() < 60 * 60 * 1000,
  }
}

function AuctionCard({ card, navigate }) {
  const detailPath = `/auctions/${card.id}`

  return (
    <a className="auction-card" href={detailPath} onClick={navigate(detailPath)}>
      <div className="auction-card__media">
        <img alt={card.alt} src={card.image} />
      </div>

      <div className="auction-card__body">
        <h3>{card.title}</h3>
        <p>{card.description}</p>

        <div className="auction-card__meta">
          <div>
            <span>Guncel</span>
            <strong>{card.price}</strong>
          </div>

          <div className="auction-card__meta-right">
            <span className={card.urgency ? 'auction-card__urgent' : ''}>
              Kalan sure
            </span>
            <strong>{card.endsIn}</strong>
          </div>
        </div>
      </div>
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
  const [isLoading, setIsLoading] = useState(true)
  const [auctionError, setAuctionError] = useState('')
  const searchQuery = useMemo(() => {
    const query = new URLSearchParams(location.search).get('search') || ''

    return query.trim()
  }, [location.search])

  useEffect(() => {
    let isCurrent = true

    async function loadAuctions() {
      setIsLoading(true)
      setAuctionError('')

      try {
        const auctionsPath = searchQuery
          ? `/api/tender?search=${encodeURIComponent(searchQuery)}&activeOnly=true`
          : '/api/v1/auctions'
        const { payload, response } = await sendAuthorizedRequest(auctionsPath)

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              payload,
              searchQuery
                ? 'Arama sonuclari yuklenemedi. Lutfen tekrar dene.'
                : 'Muzayedeler yuklenemedi. Lutfen tekrar dene.',
            ),
          )
        }

        if (isCurrent) {
          setAuctions(
            readCollection(
              payload,
              searchQuery ? 'tenders' : 'auctions',
              searchQuery ? 'Tenders' : 'Auctions',
              'items',
              'Items',
              'data',
              'Data',
            ),
          )
        }
      } catch (error) {
        if (isCurrent) {
          setAuctionError(error?.message || 'Muzayedeler yuklenemedi.')
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
  }, [searchQuery])

  const renderedAuctions = useMemo(
    () => auctions.map((auction, index) => normalizeAuction(auction, index)),
    [auctions],
  )
  const featuredAuction = renderedAuctions[0]
  const cardAuctions = renderedAuctions.slice(1)
  const emptyMessage = searchQuery
    ? `"${searchQuery}" icin sonuc bulunamadi.`
    : 'Henuz yayinda muzayede yok.'

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
              <h1>Canli Muzayedeler</h1>
              <p>
                {searchQuery
                  ? `"${searchQuery}" arama sonuclari.`
                  : 'Seckin koleksiyonerler icin kuratorlu dijital ve fiziksel varliklar.'}
              </p>
            </div>

            <div className="auctions-filters">
              <div className="filter-pill-group">
                {categoryFilters.map((filter, index) => (
                  <button
                    key={filter}
                    className={`filter-pill${index === 0 ? ' filter-pill--active' : ''}`}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {auctionError ? (
            <div className="auction-state" role="alert">
              {auctionError}
            </div>
          ) : null}

          <section className="auction-grid" aria-label="Muzayede listesi">
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
                      {featuredAuction.endsIn} kaldi
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
                      <span>Guncel Teklif</span>
                      <strong>{featuredAuction.price}</strong>
                    </div>
                  </div>

                  <div className="auction-feature__footer">
                    <div className="auction-feature__avatars" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span>+12</span>
                    </div>

                    <a
                      className="auction-feature__button"
                      href={`/auctions/${featuredAuction.id}`}
                      onClick={navigate(`/auctions/${featuredAuction.id}`)}
                    >
                      Teklif Ver
                    </a>
                  </div>
                </div>
              </article>
            ) : null}

            {!isLoading
              ? cardAuctions.map((card) => (
                  <AuctionCard card={card} key={card.id} navigate={navigate} />
                ))
              : null}
          </section>
        </main>
      </div>

      <nav className="auctions-mobile-dock" aria-label="Mobil navigasyon">
        <button className="auctions-mobile-dock__item auctions-mobile-dock__item--active" type="button">
          <span className="material-symbols-outlined">gavel</span>
          <span>Canli</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Panel</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">category</span>
          <span>Urunler</span>
        </button>
        <a className="auctions-mobile-dock__item" href="/wallet" onClick={navigate('/wallet')}>
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>Cuzdan</span>
        </a>
      </nav>
    </div>
  )
}

export default LiveAuctionsPage
