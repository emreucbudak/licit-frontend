import './App.css'

const navLinks = [
  { label: 'Canlı Müzayedeler', href: '/auctions', route: true, active: true },
  { label: 'Koleksiyonlar', href: '#showcase' },
  { label: 'Pazar Yeri', href: '#footer' },
]

const featureCards = [
  {
    accent: 'primary',
    icon: 'bolt',
    title: 'Canlı Güncellemeler',
    description:
      'Sıfıra yakın gecikmeli teklif yenilemeleriyle her hareketi gerçekleştiği anda görün.',
  },
  {
    accent: 'secondary',
    icon: 'shield',
    title: 'Güvenli Teklif Verme',
    description:
      'Çok katmanlı şifreleme ve doğrulanmış kimlik protokolleri, her işlemin güvenilir ve doğrulanabilir kalmasını sağlar.',
  },
  {
    accent: 'tertiary',
    icon: 'speed',
    title: 'Yüksek Performans',
    description:
      'Özel edge ağımız gecikmeyi küresel ölçekte azaltır ve yüksek hacimli koleksiyonculara rekabet avantajı sağlar.',
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
    links: ['Müzayedeler', 'Koleksiyonlar', 'Cüzdan', 'API'],
  },
  {
    title: 'Kaynaklar',
    links: ['Yardım Merkezi', 'Güvenlik', 'Gizlilik Politikası'],
  },
  {
    title: 'Koleksiyoner',
    links: ['Doğrulanmış Rozet', 'Ödüller', 'Topluluk'],
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
            <label className="search-shell" aria-label="Lot ara">
              <span className="material-symbols-outlined search-shell__icon">
                search
              </span>
              <input placeholder="Lot ara..." type="search" />
            </label>

            <button className="icon-button" type="button" aria-label="Bildirimler">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="icon-button" type="button" aria-label="Hesap">
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
                Gerçek zamanlı <br />
                <span className="hero-title__accent">teklif</span> <br />
                platformu
              </h1>

              <p className="hero-copy">
                Dijital varlıklar için güvenli, hızlı ve şeffaf müzayedeler.
                Yüksek hızlı alım satım, profesyonel kürasyonla buluşuyor.
              </p>

              <div className="hero-actions">
                <a className="button button--primary" href="/auctions" onClick={navigate('/auctions')}>
                  Müzayedeye Başla
                  <span className="material-symbols-outlined button__icon">
                    arrow_forward
                  </span>
                </a>
                <a className="button button--secondary" href="#features">
                  Müzayedeye Katıl
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="glass-panel featured-card">
                <div className="featured-card__frame">
                  <div className="featured-card__media">
                    <img
                      alt="Mor ve camgöbeği neon ışıklarla aydınlatılmış karanlık minimalist bir alanda süzülen fütüristik parlak 3D soyut heykel"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNxr2-O34BPqZN6TlujDCkBxIv6uk02DHTsecdsYyNka3MFzx2v5zbzoY6E9n6EHf6eWCu3gzN6Y2GCtcJwYfVx63F6yVqrOgFSTcOmI7XKioHhRqH5KiuKCiOlOCdEvSnWooRnqtmjVWPQ-BmqR_c9Y9Z1skMYZ0eOw3hn1g-1B9lXoutJGDSDDNdQKtWRFkt8LiYDQZQXESWPpkp-auzw1kOny3t3uraVSp_wtNsmFR8_8MtflF2TZiLg61534AAETwLnZQHGWM"
                    />
                  </div>

                  <div className="featured-card__content">
                    <div className="featured-card__header">
                      <h2>Cyber-Relic #082</h2>
                      <span className="countdown-badge">02s 45dk kaldı</span>
                    </div>

                    <div className="featured-card__footer">
                      <div>
                        <p className="eyebrow">Güncel Teklif</p>
                        <p className="price-tag">14.50 ETH</p>
                      </div>

                      <button className="quick-bid" type="button">
                        Hızlı Teklif
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
                  <p className="floating-activity__label">Son aktivite</p>
                  <p className="floating-activity__value">+0.4 ETH teklif verildi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-shell">
            <div className="section-header">
              <div>
                <p className="section-tag">Performans</p>
                <h2 className="section-title">
                  Hız için <br />
                  <span>tasarlandı</span>
                </h2>
                <p className="section-copy">
                  Altyapımız, binlerce eş zamanlı teklifi milisaniyenin altında
                  gecikmeyle yönetmek için geliştirildi.
                </p>
              </div>

              <span className="section-watermark">ÖZELLİKLER</span>
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
                  alt="Karanlık arka planda karmaşık dişlilere ve rose gold kaplamaya sahip premium mekanik saat mekanizmasının detaylı yakın çekimi"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQXHnPeiBvrgDiqYaTkpacMxj4Skx3uHVPPI-85HuamwV9HZ7Oqgo4k5o2AGL268ailBAwcQOutq7zjB3Ajb09VxsytFir5oM-KtDlI2N-SVEUFD-tgeO7v2j3vAZYKy3qz5RhJl18KH-WOELwYBwh00S3Ue5IzLkzNeENTCqyUZZT03aHyVE_Ls73rdYx2rGxrTcnMa7UN0Avyu5wUQHWX_Z2d5rr8MrXDDQHQL7WrVY3K5fHu8THOLIph8DWXIKTLzihikRbF5Q"
                />
                <div className="bento-card__overlay">
                  <div className="premium-tag">
                    <span className="material-symbols-outlined">stars</span>
                    <span>Özel Kürasyon</span>
                  </div>
                  <h3>Chronos Genesis</h3>
                  <p>
                    Şimdiye kadar üretilmiş en nadir zaman parçasının dijital ikizi.
                    Yalnızca Licit'te.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stats">
                <span className="material-symbols-outlined stats-icon">public</span>
                <div>
                  <p className="stats-value">120+</p>
                  <p className="stats-copy">
                    Küresel teklif ağımızda temsil edilen ülke.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stability">
                <img
                  alt="Dijital veri akışını ve hızı temsil eden siyah zeminde renkli soyut ışık çizgileri"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzsSo7GqTnqWv-QUq8eU_9NITiTiv_rdqi3HoQMaHNA158kiwjgV7h99sUaYyFy_tGBRoztH3gKzpjZol2yIpYQAOvZ05WrEWkma2Fz6cFJres2gfXcqdcLn3ibv43o60BrmNJondMO3w-rMoIbZLIOJVLvKoDAf-KQaQR0nH5EcNQc47tNeYkzX5NGfgd4oVnYsk5cmqeYUbD0uqJMTf1kq5nyV9lBP14pzDKaYKrLB00ZOtR6FTu_PUVBxcsmrjXQj3FghG7Pko"
                />
                <div className="bento-card__content bento-card__content--overlay">
                  <h4>Ağ Kararlılığı</h4>
                  <div className="progress-track" aria-hidden="true">
                    <span className="progress-track__fill"></span>
                  </div>
                  <p>%99.99 erişilebilirlik SLA'sı</p>
                </div>
              </article>

              <article className="bento-card bento-card--ladder">
                <div className="ladder-header">
                  <h4>Canlı Teklif Sıralaması</h4>
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
              Yüksek güvenilirlikli dijital müzayedeler için premium adres.
              Doğrulanmış varlıklar, gerçek zamanlı teknoloji, benzersiz güvenlik.
            </p>
            <div className="footer-socials">
              <a aria-label="E-posta" href="#footer">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
              <a aria-label="Paylaş" href="#footer">
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
          <p>&copy; 2026 Licit Platform Inc. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
