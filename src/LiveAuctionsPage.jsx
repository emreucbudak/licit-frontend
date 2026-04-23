import './LiveAuctionsPage.css'
import { AppSideNavbar, AppTopNavbar } from './AppNavigation'

const categoryFilters = ['Tümü', 'Teknoloji', 'Sanat', 'Ev']
const statusFilters = ['Canlı', 'Yakında Bitiyor']

const auctionCards = [
  {
    title: 'Custom GMMK Pro',
    subtitle: 'Buz beyazı, yağlanmış Holy Panda switchler',
    price: '$120.00',
    endsIn: '45dk 12sn',
    bids: '14 teklif',
    emphasis: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsHzSaWZ0OXBlXmW_7Ha-tVCmjujcrqkhRso8ovrJ2zB7CMMoNsseTyFdjNuHKQx6hMV732c-qQwEUS08vb-DsVSDoKPTfjd1NdO9WFbi5K3tiRPFC9bayoBg1mA4nvb7Eb5zJPGyUudeJ-a5voz4E0T-UFJ1DAmdkh_4B8nowfpmsp4hK1jAOPkwXTh7iaFvFcifxGbcx11UUb1SCv2z8wLm1nB9cztiTnv421B3G3cbpiG9avq-DNWbcjk_isEJ07oac3JhyXnI',
    alt:
      'Buzlu akrilik kasalı, pastel tuş kapaklı ve canlı RGB alt aydınlatmalı özel mekanik klavye',
  },
  {
    title: 'Audeze LCD-X Open-Back',
    subtitle: 'Creator Edition - karbon fiber kafa bandı',
    price: '$890.00',
    endsIn: '05s 22dk',
    bids: '8 teklif',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQ0RpmYnG1Y3o1gNWD_szQmQWy2-FAs58JeRiZ2cWt7gnQA9xMx6ot5IgBUY7FVkAxAj32dCIJJbPrA71auYYDZKLs6aeIDZkj1fRuGXqZkc--h2IjTCvMVvs2FqZGOq4zVmwA29rPfZvD02SlVtAqvT1OPnRw6gde_KrTFboMibFCfsU-QmGLF33DAa0m06SdKgkDZUNQ2QiUOlzpWkMc0GKwloKmwR3ugaTipFTVBRcf3jis9LyJ7hfEhIj2h8zlIF7pr-mAuU',
    alt:
      'Üst seviye ses arayüzü üzerinde duran profesyonel stüdyo kulaklığı',
  },
  {
    title: 'Grand Seiko Heritage',
    subtitle: 'Snowflake kadran SBGA211 - Spring Drive',
    price: '$4,200.00',
    endsIn: '08dk 55sn',
    bids: '31 teklif',
    urgency: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDNXwBOc4ojx8HqKSdYr_5tIw_mlCGmkAzyvrgQK_KVWLSjGg2z2a5QJ0U-MqPMzYYsOKsMNYwkeWo--5h_shiDe3YYZHYCzegr9Py-CViSm3Sm3itisnpKIZLXFHsaDi74hvc7rfRuO59hOFNqGc73z7zluiNtXsUb-9Q6ALSC-SPckrmOuwFlX4ruhm3WGwzoeKekH_qQApUHcGMt-oEzGiCAdK4r6P8PjE9Xi84ISSyUdcOhwHI2VxaK-UvDHiKggnhs2JJUuY',
    alt:
      'Dişli ve eşapman detaylarını gösteren lüks saat mekanizmasının makro çekimi',
  },
  {
    title: 'Make Noise Shared System',
    subtitle: 'Black & Gold Edition modüler sistem',
    price: '$2,100.00',
    endsIn: '12s 00dk',
    bids: '5 teklif',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA238dzWrTBBTGSS6pyGgVkyOq440JGLxTuHW_MnNhgMrF5t6iDdb1i76iiG7F-FnmBGDR1lp0o1gpN7LND-5oJHBLzhJfhe_EIZUY8h5JKKFryW6gi4nf17WeV7FPevgwVLu0i3qESr5W236Tuum4sBJZvZ6fURkGo72oUIp2xlebm_2YNVD9ogak2X3L0h-MeJLWtm9dB27g4nXLDrEnqWmAC9I-JsPwtiFilVZGnU3_gZ0Ai8x5Ku3NB7JFkQd7KRJnprP-W76s',
    alt:
      'Ahşap yan panelli, gümüş düğmeli ve patch kablolu minimalist modüler synthesizer',
  },
]

function AuctionCard({ card }) {
  return (
    <article className="auction-card">
      <div className="auction-card__media">
        <img alt={card.alt} src={card.image} />
        <div className="auction-card__badge">{card.bids}</div>
      </div>

      <div className="auction-card__body">
        <h3>{card.title}</h3>
        <p>{card.subtitle}</p>

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
    </article>
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
  return (
    <div className="auctions-page">
      <AppTopNavbar currentPath="/auctions" navigate={navigate} />

      <div className="auctions-shell">
        <AppSideNavbar
          currentPath="/auctions"
          navigate={navigate}
          onLogout={onLogout}
        />

        <main className="auctions-main">
          <div className="auctions-main__header">
            <div>
              <h1>Canlı Müzayedeler</h1>
              <p>
                Seçkin koleksiyonerler için küratörlü dijital ve fiziksel varlıklar.
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

              <div className="auctions-filters__divider"></div>

              <div className="filter-pill-group">
                {statusFilters.map((filter, index) => (
                  <button
                    key={filter}
                    className={`filter-pill${index === 0 ? ' filter-pill--accent' : ''}`}
                    type="button"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="auction-grid" aria-label="Müzayede listesi">
            <article className="auction-feature">
              <div className="auction-feature__media">
                <img
                  alt="Metal krom gövdeli ve siyah deri tutuşlu premium vintage film kamerasının dramatik stüdyo ışığında yakın çekimi"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj8KFbP6P_e_F-eKJJN0yxsB3gtrT06H9IX1BosthXFCHeq0dFdgaZrUTKZydbDXPF24Qsir99du0nYRfdpGFTxQEqLgh5NX2v6A-B5lJPDA6x0O1ppBw3pYJ1E17i99GdPzdCtlh0r6i3q_TgccUql40i84-bPRz0GdGgKf0sYECjPcDVHlbcI0rW9FUWw8Ms0EQd2wvwxmajQEX7UEVi3Tf2ZwMQECpDqErL0Fr7f5cyUm9tP6A1OCTSnaQEHMGf3ZA1pLL7ma4"
                />

                <div className="auction-feature__badges">
                  <span className="auction-badge auction-badge--live">
                    <span className="auction-badge__pulse" aria-hidden="true"></span>
                    Canlı
                  </span>
                  <span className="auction-badge auction-badge--timer">
                    02s 45dk kaldı
                  </span>
                </div>
              </div>

              <div className="auction-feature__panel">
                <div className="auction-feature__header">
                  <div>
                    <h2>Leica M6 Classic Vintage</h2>
                    <p>Seri No. 24891 - koleksiyonluk kondisyonda</p>
                  </div>

                  <div className="auction-feature__price">
                    <span>Güncel Teklif</span>
                    <strong>$3,450.00</strong>
                  </div>
                </div>

                <div className="auction-feature__footer">
                  <div className="auction-feature__avatars" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span>+24</span>
                  </div>

                  <a
                    className="auction-feature__button"
                    href="/auctions/lot-4429"
                    onClick={navigate('/auctions/lot-4429')}
                  >
                    Teklif Ver
                  </a>
                </div>
              </div>
            </article>

            <AuctionCard card={auctionCards[0]} />
            <AuctionCard card={auctionCards[1]} />
            <SkeletonCard />
            <AuctionCard card={auctionCards[2]} />
            <SkeletonCard />
            <AuctionCard card={auctionCards[3]} />
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
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>Cüzdan</span>
        </button>
      </nav>
    </div>
  )
}

export default LiveAuctionsPage
