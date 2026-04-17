import './LiveAuctionsPage.css'

const topNavLinks = [
  { label: 'Explore', href: '/', route: true, active: true },
  { label: 'Activity', href: '#', active: false },
  { label: 'How it works', href: '#', active: false },
]

const sideNavLinks = [
  { label: 'Live Auctions', icon: 'gavel', active: true },
  { label: 'Dashboard', icon: 'dashboard', active: false },
  { label: 'Collections', icon: 'category', active: false },
  { label: 'Wallet', icon: 'account_balance_wallet', active: false },
  { label: 'Settings', icon: 'settings', active: false },
]

const footerNavLinks = [
  { label: 'Help Center', icon: 'help' },
  { label: 'Sign Out', icon: 'logout' },
]

const categoryFilters = ['All', 'Tech', 'Art', 'Home']
const statusFilters = ['Live', 'Ending Soon']

const auctionCards = [
  {
    title: 'Custom GMMK Pro',
    subtitle: 'Ice White, Lubed Holy Panda Switches',
    price: '$120.00',
    endsIn: '45m 12s',
    bids: '14 bids',
    emphasis: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsHzSaWZ0OXBlXmW_7Ha-tVCmjujcrqkhRso8ovrJ2zB7CMMoNsseTyFdjNuHKQx6hMV732c-qQwEUS08vb-DsVSDoKPTfjd1NdO9WFbi5K3tiRPFC9bayoBg1mA4nvb7Eb5zJPGyUudeJ-a5voz4E0T-UFJ1DAmdkh_4B8nowfpmsp4hK1jAOPkwXTh7iaFvFcifxGbcx11UUb1SCv2z8wLm1nB9cztiTnv421B3G3cbpiG9avq-DNWbcjk_isEJ07oac3JhyXnI',
    alt:
      'Custom mechanical keyboard with frosted acrylic case, pastel keycaps, and vibrant RGB underglow, soft focus desk setup',
  },
  {
    title: 'Audeze LCD-X Open-Back',
    subtitle: 'Creator Edition - Carbon Fiber Headband',
    price: '$890.00',
    endsIn: '05h 22m',
    bids: '8 bids',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQ0RpmYnG1Y3o1gNWD_szQmQWy2-FAs58JeRiZ2cWt7gnQA9xMx6ot5IgBUY7FVkAxAj32dCIJJbPrA71auYYDZKLs6aeIDZkj1fRuGXqZkc--h2IjTCvMVvs2FqZGOq4zVmwA29rPfZvD02SlVtAqvT1OPnRw6gde_KrTFboMibFCfsU-QmGLF33DAa0m06SdKgkDZUNQ2QiUOlzpWkMc0GKwloKmwR3ugaTipFTVBRcf3jis9LyJ7hfEhIj2h8zlIF7pr-mAuU',
    alt:
      'Professional studio monitor headphones resting on a high-end audio interface, warm amber ambient lighting, detailed texture',
  },
  {
    title: 'Grand Seiko Heritage',
    subtitle: 'Snowflake Dial SBGA211 - Spring Drive',
    price: '$4,200.00',
    endsIn: '08m 55s',
    bids: '31 bids',
    urgency: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDNXwBOc4ojx8HqKSdYr_5tIw_mlCGmkAzyvrgQK_KVWLSjGg2z2a5QJ0U-MqPMzYYsOKsMNYwkeWo--5h_shiDe3YYZHYCzegr9Py-CViSm3Sm3itisnpKIZLXFHsaDi74hvc7rfRuO59hOFNqGc73z7zluiNtXsUb-9Q6ALSC-SPckrmOuwFlX4ruhm3WGwzoeKekH_qQApUHcGMt-oEzGiCAdK4r6P8PjE9Xi84ISSyUdcOhwHI2VxaK-UvDHiKggnhs2JJUuY',
    alt:
      'Macro shot of a luxury watch movement showing gears and escapement, technical and industrial aesthetic, cool blue tones',
  },
  {
    title: 'Make Noise Shared System',
    subtitle: 'Black & Gold Edition Modular Rig',
    price: '$2,100.00',
    endsIn: '12h 00m',
    bids: '5 bids',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA238dzWrTBBTGSS6pyGgVkyOq440JGLxTuHW_MnNhgMrF5t6iDdb1i76iiG7F-FnmBGDR1lp0o1gpN7LND-5oJHBLzhJfhe_EIZUY8h5JKKFryW6gi4nf17WeV7FPevgwVLu0i3qESr5W236Tuum4sBJZvZ6fURkGo72oUIp2xlebm_2YNVD9ogak2X3L0h-MeJLWtm9dB27g4nXLDrEnqWmAC9I-JsPwtiFilVZGnU3_gZ0Ai8x5Ku3NB7JFkQd7KRJnprP-W76s',
    alt:
      'Minimalist modular synthesizer module with wooden side panels, silver knobs, and patch cables, bright studio lighting',
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
            <span>Current</span>
            <strong>{card.price}</strong>
          </div>

          <div className="auction-card__meta-right">
            <span className={card.urgency ? 'auction-card__urgent' : ''}>
              Ends in
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

function LiveAuctionsPage({ navigate }) {
  return (
    <div className="auctions-page">
      <header className="auctions-topbar">
        <div className="auctions-topbar__brand-row">
          <a className="auctions-brand" href="/" onClick={navigate('/')}>
            Licit
          </a>

          <nav className="auctions-topbar__nav" aria-label="Primary navigation">
            {topNavLinks.map((link) => (
              <a
                key={link.label}
                className={`auctions-topbar__link${
                  link.active ? ' auctions-topbar__link--active' : ''
                }`}
                href={link.href}
                onClick={link.route ? navigate(link.href) : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="auctions-topbar__actions">
          <label className="auctions-search" aria-label="Search auctions">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Search auctions..." type="search" />
          </label>

          <button
            className="auctions-icon-button auctions-icon-button--live"
            type="button"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="auctions-icon-button__dot" aria-hidden="true"></span>
          </button>

          <button className="auctions-icon-button" type="button" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <div className="auctions-shell">
        <aside className="auctions-sidebar">
          <div className="auctions-sidebar__profile">
            <div className="auctions-sidebar__avatar">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <div className="auctions-sidebar__name">Collector</div>
              <div className="auctions-sidebar__role">Verified Member</div>
            </div>
          </div>

          <div className="auctions-sidebar__nav">
            {sideNavLinks.map((link) => (
              <a
                key={link.label}
                className={`auctions-sidebar__link${
                  link.active ? ' auctions-sidebar__link--active' : ''
                }`}
                href="#"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <button className="auctions-sidebar__cta" type="button">
            Create Auction
          </button>

          <div className="auctions-sidebar__footer">
            {footerNavLinks.map((link) => (
              <a key={link.label} className="auctions-sidebar__link" href="#">
                <span className="material-symbols-outlined">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </aside>

        <main className="auctions-main">
          <div className="auctions-main__header">
            <div>
              <h1>Live Auctions</h1>
              <p>
                Curated digital and physical assets for elite collectors.
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

          <section className="auction-grid" aria-label="Auction listing">
            <article className="auction-feature">
              <div className="auction-feature__media">
                <img
                  alt="Close-up of a premium vintage film camera with metallic chrome body and black leather grip, dramatic studio lighting against a dark slate background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj8KFbP6P_e_F-eKJJN0yxsB3gtrT06H9IX1BosthXFCHeq0dFdgaZrUTKZydbDXPF24Qsir99du0nYRfdpGFTxQEqLgh5NX2v6A-B5lJPDA6x0O1ppBw3pYJ1E17i99GdPzdCtlh0r6i3q_TgccUql40i84-bPRz0GdGgKf0sYECjPcDVHlbcI0rW9FUWw8Ms0EQd2wvwxmajQEX7UEVi3Tf2ZwMQECpDqErL0Fr7f5cyUm9tP6A1OCTSnaQEHMGf3ZA1pLL7ma4"
                />

                <div className="auction-feature__badges">
                  <span className="auction-badge auction-badge--live">
                    <span className="auction-badge__pulse" aria-hidden="true"></span>
                    Live
                  </span>
                  <span className="auction-badge auction-badge--timer">
                    Ending in 02h 45m
                  </span>
                </div>
              </div>

              <div className="auction-feature__panel">
                <div className="auction-feature__header">
                  <div>
                    <h2>Leica M6 Classic Vintage</h2>
                    <p>Serial No. 24891 - Mint Condition</p>
                  </div>

                  <div className="auction-feature__price">
                    <span>Current Bid</span>
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
                    Place Bid
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

      <nav className="auctions-mobile-dock" aria-label="Mobile navigation">
        <button className="auctions-mobile-dock__item auctions-mobile-dock__item--active" type="button">
          <span className="material-symbols-outlined">gavel</span>
          <span>Live</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dash</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">category</span>
          <span>Items</span>
        </button>
        <button className="auctions-mobile-dock__item" type="button">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span>Wallet</span>
        </button>
      </nav>
    </div>
  )
}

export default LiveAuctionsPage
