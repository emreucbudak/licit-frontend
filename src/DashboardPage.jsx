import './DashboardPage.css'

const statsCards = [
  {
    label: 'Toplam Teklif',
    value: '142',
    note: 'Bu hafta +%12',
    tone: 'secondary',
    icon: 'payments',
    noteIcon: 'trending_up',
  },
  {
    label: 'Kazanılan Müzayedeler',
    value: '28',
    note: 'İlk %5 alıcı',
    tone: 'primary',
    icon: 'emoji_events',
    noteIcon: 'workspace_premium',
  },
  {
    label: 'Aktif İlanlar',
    value: '09',
    note: '3 tanesi bugün bitiyor',
    tone: 'neutral',
    icon: 'visibility',
    noteIcon: 'schedule',
  },
]

const activeAuctions = [
  {
    title: 'Kuantum Prizma #042',
    status: 'Öndesin',
    tone: 'secondary',
    currentBid: '4.20 ETH',
    endsIn: '04:12:44',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBkI3FqStyasHTMFE8FS1K3VLwUo8Ge5kGEWA3G3oDKdWq1SgYZzk23bwpGo9TV9VhBmkk2li5FsqrPb47027MXVaosR0BdO73v7ZtPotCPTyxpfyS1DpGQvzPFMaTZrSZZOVQwnCeml1iQm964tjxJM8XhEO_Nr5RGo9KEpebYMJMemEGAL390KGbHPqXXlqCLm7WTEvXl0Xb21NtycUiPcHGch7WiFPH6lluE1d71a3q4Ok2g-RtXTXbCGZ7aMWaB7dF3fbakA4',
    alt:
      'Derin mor ve camgöbeği tonlarında parlayan, fütüristik devre desenli soyut dijital neon kart',
  },
  {
    title: '1964 Kronograf',
    status: 'Geçildin',
    tone: 'tertiary',
    currentBid: '$12,400',
    endsIn: '22:05:12',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdetb6oFJ3ij7DLDy4CGPi9RCLv3Wi5d_fBPOFt4naQ9o2YHzKKgIoYPq-73erRvIMDtsTlDi8m42nWV0JYynhKRth_9BqLFI7sQ-0GX-8gNMEbXi6XFyOfz8zfYVyT-ET0SCBfhqSSeS7xj96_ZaJ2D6JNp80PnPI4x5h-HODG_dSkGU_ns5z5H1ZKUaFptb2PCyibb7cgZP7hL7fOkgFdVjKqUXbrifBfa1BWO94Lsnpkz9ok-GZbp2KYvRlvYAGVKw12pehB5A',
    alt:
      'Koyu kadife yüzey üzerinde ince altın detaylara sahip üst seviye mekanik kol saati kadranının yakın çekimi',
  },
]

const bidHistory = [
  {
    date: '24 Eki 2023',
    item: 'Eterik Parça #09',
    bid: '1.85 ETH',
    status: 'Öndesin',
    tone: 'secondary',
    action: 'open',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBr-CET40p7xe2JZRsdifpVUdzRDnW_N6B53hWzUzKGtAcPNJIlnbBFegLubuOy_sWZ196Rw049IjExVzcT1qTXja2TdSL1-UABna93X5EeTVu6k2FXtnYEa4hKOtW5ZTbXBcmvaHsYpXENdMF8H8oKbMXOCI0pqYNei3zpc1s-FG8gCMdX-sVocLoewmol3Qf5785yJddoDkQRgMVPhLmSKE3QZ7BV-W3s606gBXggOMEJ73bYvW6M8qoJeeTHYRC4JLyMVQIaOUM',
  },
  {
    date: '23 Eki 2023',
    item: 'Leica M6 Classic',
    bid: '$3,200',
    status: 'Geçildin',
    tone: 'tertiary',
    action: 'rebid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAvvNOcDnV52ocok7HAe__OqGPJ4qfUmhhkocF1DRyXLzYwZGSi6FGjNQx-AT0nAQpBNSY9yOv51lVX-F2GrNrMhLvpYZtpNsWQR4P1IkCXPzwZBD_6hzuj7D38TZo8dp1Qe6P36VZv3vIA5JLMCWq8sN89DPXLyC8KnTWaT8k_GYAVIed89I5mGvecWr5QYJi0HbYq8cqtt31Txp1TLH3OSdsVPMeB8Du_IKR6DIXQWJ_WbYQXvr17fZNrKS0FL6z6DLAAAcA7lI',
  },
  {
    date: '21 Eki 2023',
    item: 'El Yazması Cilt 1',
    bid: '0.45 ETH',
    status: 'Öndesin',
    tone: 'secondary',
    action: 'open',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgPgSvv2SIDJexLtAX5i36LcHIJU3YZsntVFH_UDqN9iEQMer9y6xGriNv9hqTPnly6ByXF9vSV75jQaB75z-BaSp2hqVpSZTzJNiQsQYsetvaQDbbX9RfkSdcinHFGQgg9GDPya_Sy2LyeIHz3XKgG8F7wcYEiqjXwlmaOjhcaUV73FYK7YsArNxiqQS1wWe6oDfmOYedw0aAaZ81yd4Em6JTNUoT4A6j4laLRKfG96QC5QMxbC4x_SPz7TPbTqyK9LPRLx7XoY',
  },
  {
    date: '20 Eki 2023',
    item: 'Metropolis Gökyüzü #12',
    bid: '2.10 ETH',
    status: 'Geçildin',
    tone: 'tertiary',
    action: 'rebid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjMgIviHVgJs_xnHcZ8tb3ysG5gP9CE0OFq_2FvHwQ4wgc7L0DLjVIy8fj9ltPzNRa9M8QSGW27iqRhxvjnDv6h-RZuYOyqJZfZnA6-DS2urlmTDYvaULFo1cstRywgreKPaTRXZbRUdWDseapB0iGjPxOH2yPttliJKnq0ABlTPL6_ZXb4rJtVSKTKUTvX6TSe2qMqvoxFySQl69XKBDaqZOjy-p-OpBoAql1If0JaybrK17E2XE9tf_xC_e_3yTgRrWuvq-gO80',
  },
]

const liveFeed = [
  ['Siberpunk #88', 'Teklif +0.5 ETH', 'secondary'],
  ['Altın Rolex 1950', '2dk içinde bitiyor', 'tertiary'],
  ['Modernist Villa', '$2.4M karşılığında satıldı', 'primary'],
  ['Elmas Aura NFT', 'Teklif +1.2 ETH', 'secondary'],
]

function DashboardPage({ navigate }) {
  return (
    <div className="dashboard-page">
      <nav className="dashboard-topbar">
        <div className="dashboard-topbar__brand-row">
          <a className="dashboard-brand" href="/" onClick={navigate('/')}>
            Licit
          </a>
          <div className="dashboard-topbar__nav">
            <a
              className="dashboard-topbar__link dashboard-topbar__link--active"
              href="/dashboard"
              onClick={navigate('/dashboard')}
            >
              Panel
            </a>
            <a className="dashboard-topbar__link" href="#">
              Pazar Yeri
            </a>
            <a className="dashboard-topbar__link" href="/auctions" onClick={navigate('/auctions')}>
              Canlı Müzayedeler
            </a>
          </div>
        </div>

        <div className="dashboard-topbar__actions">
          <label className="dashboard-search" aria-label="Müzayede ara">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Müzayede ara..." type="search" />
          </label>
          <button className="dashboard-icon-button" type="button" aria-label="Bildirimler">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="dashboard-icon-button" type="button" aria-label="Hesap">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__profile">
          <div className="dashboard-sidebar__avatar">
            <img
              alt="Yumuşak stüdyo ışığında nötr ifadeli profesyonel portre yakın çekimi"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc6SLQK9aqRbI6M4eyHYIBBBsdnafh9MMtSAdZa2QiETKkG7xWzBxgV88T-Y76LHZAjjUuRXcbjkAJChiaJ8i9N-nOy90uIPRwG2Hpc9EWEe3lG1ZNTaXVclYaH7mjGT3G4jeNg06kXWKY5FKOtC9xxTHAYZcHJSBNh_hF--UyTjTloChBP2Aa222dW8fYhmwFSaZrddZ4l3mvzuLRcuHLOs28L3R7bbToPcyqIR-p543hHKXNyNAcSWaMc78YGKxtiTGDPxwLeFk"
            />
          </div>
          <div>
            <p>Koleksiyoner</p>
            <span>Doğrulanmış Üye</span>
          </div>
        </div>

        <div className="dashboard-sidebar__links">
          <a className="dashboard-sidebar__link" href="/auctions" onClick={navigate('/auctions')}>
            <span className="material-symbols-outlined">gavel</span>
            Canlı Müzayedeler
          </a>
          <a
            className="dashboard-sidebar__link dashboard-sidebar__link--active"
            href="/dashboard"
            onClick={navigate('/dashboard')}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Panel
          </a>
          <a className="dashboard-sidebar__link" href="#">
            <span className="material-symbols-outlined">category</span>
            Koleksiyonlar
          </a>
          <a className="dashboard-sidebar__link" href="#">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Cüzdan
          </a>
          <a className="dashboard-sidebar__link" href="#">
            <span className="material-symbols-outlined">settings</span>
            Ayarlar
          </a>
        </div>

        <button className="dashboard-sidebar__cta" type="button">
          <span className="material-symbols-outlined">add</span>
          Müzayede Oluştur
        </button>

        <div className="dashboard-sidebar__footer">
          <a className="dashboard-sidebar__footer-link" href="#">
            <span className="material-symbols-outlined">help</span>
            Yardım Merkezi
          </a>
          <a className="dashboard-sidebar__footer-link" href="#">
            <span className="material-symbols-outlined">logout</span>
            Çıkış Yap
          </a>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <div>
              <h1>Hesap Özeti</h1>
              <p>Teklif hızını ve aktif varlıklarını takip et.</p>
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
                <h3>Aktif Müzayedelerim</h3>
                <button type="button">Tümünü Gör</button>
              </div>
              <div className="dashboard-active__list">
                {activeAuctions.map((auction) => (
                  <article key={auction.title} className="dashboard-auction-card">
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
                        <div><span>Güncel Teklif</span><strong>{auction.currentBid}</strong></div>
                        <div className="dashboard-auction-card__meta-right"><span>Kalan Süre</span><strong>{auction.endsIn}</strong></div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-history">
              <div className="dashboard-section-head">
                <h3>Teklif Geçmişi</h3>
                <div className="dashboard-history__actions">
                  <button type="button">CSV Dışa Aktar</button>
                  <button type="button"><span className="material-symbols-outlined">filter_list</span>Filtrele</button>
                </div>
              </div>
              <div className="dashboard-table-shell">
                <table className="dashboard-table">
                  <thead>
                    <tr><th>Tarih</th><th>Ürün</th><th>Teklifin</th><th>Durum</th><th className="dashboard-table__right">İşlem</th></tr>
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
                            <button className="dashboard-table__rebid" type="button">Yeniden Teklif</button>
                          ) : (
                            <button className="dashboard-table__open" type="button" aria-label="Müzayedeyi aç"><span className="material-symbols-outlined">open_in_new</span></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="dashboard-table__footer">
                  <p>12 tekliften 4 tanesi gösteriliyor</p>
                  <div className="dashboard-pagination">
                    <button type="button" aria-label="Önceki sayfa"><span className="material-symbols-outlined">chevron_left</span></button>
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
            <div className="dashboard-feed__label"><span>Canlı Akış</span><div></div></div>
            <div className="dashboard-feed__items">
              {liveFeed.map(([title, value, tone]) => (
                <div key={`${title}-${value}`} className="dashboard-feed__item">
                  <span className="dashboard-feed__title">{title}</span>
                  <span className={`dashboard-feed__value dashboard-feed__value--${tone}`}>{value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <nav className="dashboard-mobile-nav">
        <button type="button"><span className="material-symbols-outlined">gavel</span><span>Canlı</span></button>
        <button className="dashboard-mobile-nav__active" type="button"><span className="material-symbols-outlined">dashboard</span><span>Panel</span></button>
        <button type="button"><span className="material-symbols-outlined">add_circle</span><span>Sat</span></button>
        <button type="button"><span className="material-symbols-outlined">account_balance_wallet</span><span>Cüzdan</span></button>
        <button type="button"><span className="material-symbols-outlined">person</span><span>Profil</span></button>
      </nav>
    </div>
  )
}

export default DashboardPage
