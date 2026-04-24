import { useEffect, useState } from 'react'
import './App.css'

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

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frameId = 0
    const startTime = performance.now()

    const tick = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setValue(Math.round(progress * target))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [duration, target])

  return value
}

function LandingPage({ navigate }) {
  const totalTransactions = useCountUp(24800, 1600)
  const representedCountries = useCountUp(120)
  const satisfactionRate = useCountUp(98)
  const completedSalesRate = useCountUp(97)

  return (
    <div className="landing-page">
      <nav className="top-nav">
        <div className="top-nav__inner">
          <div className="top-nav__brand-row">
            <a className="brand" href="/" onClick={navigate('/')}>
              Licit
            </a>
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
                <a
                  className="button button--primary"
                  href="/auctions/create"
                  onClick={navigate('/auctions/create')}
                >
                  İhale Oluştur
                  <span className="material-symbols-outlined button__icon">
                    arrow_forward
                  </span>
                </a>
                <a
                  className="button button--secondary"
                  href="/auctions"
                  onClick={navigate('/auctions')}
                >
                  Aktif İhaleleri Gör
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
              <article className="bento-card bento-card--featured bento-card--featured-metric">
                <div className="bento-card__feature-metric">
                  <p className="bento-card__feature-label">Toplam İşlem Sayısı</p>
                  <strong className="bento-card__feature-value">
                    {totalTransactions.toLocaleString('tr-TR')}+
                  </strong>
                  <p className="bento-card__feature-copy">
                    Platform üzerinde tamamlanan teklif ve satış hareketlerinin toplamı.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stats">
                <span className="material-symbols-outlined stats-icon">public</span>
                <div>
                  <p className="stats-value">{representedCountries}+</p>
                  <p className="stats-copy">
                    Küresel teklif ağımızda temsil edilen ülke.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--stability">
                <div className="bento-card__content bento-card__content--overlay">
                  <h4>Kullanıcı Memnuniyeti</h4>
                  <strong className="bento-card__metric">{satisfactionRate}%</strong>
                  <p className="bento-card__metric-copy">
                    Teklif deneyimini güçlü ve güvenilir bulan aktif kullanıcı oranı.
                  </p>
                </div>
              </article>

              <article className="bento-card bento-card--ladder bento-card--completion">
                <div className="bento-card__completion">
                  <h4>Tamamlanan Satış</h4>
                  <strong className="bento-card__metric">{completedSalesRate}%</strong>
                  <p className="bento-card__metric-copy">
                    Yayına alınan uygun lotların başarıyla sonuçlanma oranı.
                  </p>
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
              <a
                aria-label="GitHub"
                href="https://github.com/emreucbudak"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-[18px] w-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.06 8.2 11.68.6.11.82-.27.82-.6 0-.3-.01-1.1-.02-2.16-3.34.75-4.04-1.66-4.04-1.66-.55-1.43-1.33-1.81-1.33-1.81-1.09-.76.08-.75.08-.75 1.2.09 1.83 1.28 1.83 1.28 1.08 1.9 2.83 1.35 3.52 1.04.11-.8.42-1.35.76-1.66-2.66-.31-5.47-1.37-5.47-6.1 0-1.35.47-2.45 1.24-3.31-.13-.31-.54-1.57.12-3.27 0 0 1.01-.33 3.3 1.26A11.2 11.2 0 0 1 12 6.83c1.02 0 2.05.14 3.01.42 2.29-1.59 3.3-1.26 3.3-1.26.66 1.7.25 2.96.12 3.27.77.86 1.24 1.96 1.24 3.31 0 4.74-2.81 5.79-5.49 6.09.43.38.82 1.12.82 2.27 0 1.64-.01 2.96-.01 3.36 0 .33.21.72.82.6A12.31 12.31 0 0 0 24 12.3C24 5.5 18.63 0 12 0Z" />
                </svg>
              </a>
              <a
                aria-label="LinkedIn"
                href="https://www.linkedin.com/in/emre-%C3%BC%C3%A7budak-1b5587304/"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-[18px] w-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5A2.48 2.48 0 1 1 0 3.5a2.48 2.48 0 0 1 4.98 0ZM.4 8.32h4.7V24H.4V8.32ZM8.05 8.32h4.5v2.14h.06c.63-1.2 2.16-2.46 4.44-2.46 4.75 0 5.63 3.18 5.63 7.31V24h-4.7v-7.65c0-1.83-.03-4.19-2.5-4.19-2.5 0-2.88 1.99-2.88 4.05V24h-4.7V8.32Z" />
                </svg>
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
