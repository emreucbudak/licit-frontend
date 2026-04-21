import './App.css'

const navLinks = [
  { label: 'Live Auctions', href: '/auctions', route: true, active: true },
  { label: 'Collections', href: '#showcase' },
  { label: 'Marketplace', href: '#footer' },
]

const featureCards = [
  {
    accent: 'primary',
    icon: 'bolt',
    title: 'Live Updates',
    description:
      'Experience zero-lag bid refreshes. Our real-time engine ensures you see every movement the millisecond it happens.',
  },
  {
    accent: 'secondary',
    icon: 'shield',
    title: 'Secure Bidding',
    description:
      'Multi-layer encryption and verified identity protocols ensure that every transaction is iron-clad and authentic.',
  },
  {
    accent: 'tertiary',
    icon: 'speed',
    title: 'Fast Performance',
    description:
      'A specialized edge network minimizes latency globally, providing a competitive edge for high-stakes collectors.',
  },
]

const bidLadder = [
  { bidder: 'Collector_X99', amount: '24.80 ETH', status: 'leading' },
  { bidder: 'Arty_Master', amount: '24.75 ETH', status: 'standard' },
  { bidder: 'Whale_Alpha', amount: '24.50 ETH', status: 'faded' },
]

const footerColumns = [
  {
    title: 'Platform',
    links: ['Auctions', 'Collections', 'Wallet', 'API'],
  },
  {
    title: 'Resources',
    links: ['Help Center', 'Security', 'Privacy Policy'],
  },
  {
    title: 'Collector',
    links: ['Verified Badge', 'Rewards', 'Community'],
  },
]

function LandingPage({ navigate }) {
  return (
    <div className="landing-page">
      <nav className="top-nav">
        <div className="top-nav__inner">
          <div className="top-nav__brand-row">
            <a className="brand" href="/" onClick={navigate('/')}>
              Licit
            </a>
            <div className="nav-links" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  className={`nav-link${link.active ? ' nav-link--active' : ''}`}
                  href={link.href}
                  onClick={link.route ? navigate(link.href) : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="top-nav__actions">
            <label className="search-shell" aria-label="Search lots">
              <span className="material-symbols-outlined search-shell__icon">
                search
              </span>
              <input placeholder="Search lots..." type="search" />
            </label>

            <button className="icon-button" type="button" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-button" type="button" aria-label="Account">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="hero-section" id="live-auctions">
          <div className="section-shell hero-grid">
            <div className="hero-copy-block">
              <h1 className="hero-title">
                Real-time <br />
                <span className="hero-title__accent">bidding</span> <br />
                platform
              </h1>

              <p className="hero-copy">
                Secure, fast, and transparent auctions for digital assets.
                High-velocity trading meets professional curation.
              </p>

              <div className="hero-actions">
                <a className="button button--primary" href="/auctions" onClick={navigate('/auctions')}>
                  Start Auction
                  <span className="material-symbols-outlined button__icon">
                    arrow_forward
                  </span>
                </a>
                <a className="button button--secondary" href="#features">
                  Join Auction
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="glass-panel featured-card">
                <div className="featured-card__frame">
                  <div className="featured-card__media">
                    <img
                      alt="Futuristic glowing 3D abstract sculpture floating in a dark minimalist space with purple and cyan neon lights"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNxr2-O34BPqZN6TlujDCkBxIv6uk02DHTsecdsYyNka3MFzx2v5zbzoY6E9n6EHf6eWCu3gzN6Y2GCtcJwYfVx63F6yVqrOgFSTcOmI7XKioHhRqH5KiuKCiOlOCdEvSnWooRnqtmjVWPQ-BmqR_c9Y9Z1skMYZ0eOw3hn1g-1B9lXoutJGDSDDNdQKtWRFkt8LiYDQZQXESWPpkp-auzw1kOny3t3uraVSp_wtNsmFR8_8MtflF2TZiLg61534AAETwLnZQHGWM"
                    />
                  </div>

                  <div className="featured-card__content">
                    <div className="featured-card__header">
                      <h2>Cyber-Relic #082</h2>
                      <span className="countdown-badge">Ends in 02h 45m</span>
                    </div>

                    <div className="featured-card__footer">
                      <div>
                        <p className="eyebrow">Current Bid</p>
                        <p className="price-tag">14.50 ETH</p>
                      </div>

                      <button className="quick-bid" type="button">
                        Quick Bid
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel floating-activity" aria-hidden="true">
                <div className="floating-activity__icon">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="floating-activity__label">Last activity</p>
                  <p className="floating-activity__value">+0.4 ETH bid placed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-shell">
            <div className="section-header">
              <div>
                <p className="section-tag">Performance</p>
                <h2 className="section-title">
                  Engineered for <br />
                  <span>speed</span>
                </h2>
                <p className="section-copy">
                  Our infrastructure is built to handle thousands of concurrent
                  bids with sub-millisecond latency.
                </p>
              </div>

              <span className="section-watermark">FEATURES</span>
            </div>

            <div className="feature-grid">
              {featureCards.map((feature) => (
                <article
                  key={feature.title}
                  className={`feature-card feature-card--${feature.accent}`}
                >
                  <div className="feature-card__icon">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="showcase-section" id="showcase">
          <div className="section-shell">
            <div className="bento-grid">
              <article className="bento-card bento-card--featured">
                <img
                  alt="Detailed close-up of a premium mechanical watch movement with intricate gears and rose gold plating against a dark background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQXHnPeiBvrgDiqYaTkpacMxj4Skx3uHVPPI-85HuamwV9HZ7Oqgo4k5o2AGL268ailBAwcQOutq7zjB3Ajb09VxsytFir5oM-KtDlI2N-SVEUFD-tgeO7v2j3vAZYKy3qz5RhJl18KH-WOELwYBwh00S3Ue5IzLkzNeENTCqyUZZT03aHyVE_Ls73rdYx2rGxrTcnMa7UN0Avyu5wUQHWX_Z2d5rr8MrXDDQHQL7WrVY3K5fHu8THOLIph8DWXIKTLzihikRbF5Q"
                />
                <div className="bento-card__overlay">
                  <div className="premium-tag">
                    <span className="material-symbols-outlined">stars</span>
                    <span>Premium Curated</span>
                  </div>
                  <h3>Chronos Genesis</h3>
                  <p>
                    A digital twin of the rarest timepiece ever created.
                    Exclusively on Licit.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stats">
                <span className="material-symbols-outlined stats-icon">public</span>
                <div>
                  <p className="stats-value">120+</p>
                  <p className="stats-copy">
                    Countries represented in our global bidding network.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stability">
                <img
                  alt="Abstract colorful light streaks on a black canvas representing digital data flow and speed"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzsSo7GqTnqWv-QUq8eU_9NITiTiv_rdqi3HoQMaHNA158kiwjgV7h99sUaYyFy_tGBRoztH3gKzpjZol2yIpYQAOvZ05WrEWkma2Fz6cFJres2gfXcqdcLn3ibv43o60BrmNJondMO3w-rMoIbZLIOJVLvKoDAf-KQaQR0nH5EcNQc47tNeYkzX5NGfgd4oVnYsk5cmqeYUbD0uqJMTf1kq5nyV9lBP14pzDKaYKrLB00ZOtR6FTu_PUVBxcsmrjXQj3FghG7Pko"
                />
                <div className="bento-card__content bento-card__content--overlay">
                  <h4>Network Stability</h4>
                  <div className="progress-track" aria-hidden="true">
                    <span className="progress-track__fill"></span>
                  </div>
                  <p>99.99% Uptime SLA</p>
                </div>
              </article>

              <article className="bento-card bento-card--ladder">
                <div className="ladder-header">
                  <h4>Live Bid Ladder</h4>
                  <div className="ladder-avatars" aria-hidden="true">
                    <span className="ladder-avatars__item ladder-avatars__item--one"></span>
                    <span className="ladder-avatars__item ladder-avatars__item--two"></span>
                    <span className="ladder-avatars__item ladder-avatars__item--three"></span>
                  </div>
                </div>

                <div className="ladder-list">
                  {bidLadder.map((entry) => (
                    <div
                      key={entry.bidder}
                      className={`ladder-row ladder-row--${entry.status}`}
                    >
                      <span>{entry.bidder}</span>
                      <strong>{entry.amount}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="section-shell footer-grid">
          <div className="footer-brand">
            <a className="brand brand--footer" href="/" onClick={navigate('/')}>
              Licit
            </a>
            <p>
              The premier destination for high-fidelity digital auctions.
              Verified assets, real-time technology, unparalleled security.
            </p>
            <div className="footer-socials">
              <a aria-label="Email" href="#footer">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
              <a aria-label="Share" href="#footer">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>

          <div className="footer-links">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h5>{column.title}</h5>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#footer">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell footer-bottom">
          <p>&copy; 2026 Licit Platform Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
