import './LotDetailPage.css'

const galleryImages = [
  {
    alt: 'Macro detail shot of watch movement showing copper gears and blue steel screws with sharp focus',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFFGG9hhajC-rn79MlByaDR2cuCxjVf4EyQadtyc4MydPYC59vVd858s58Z6JRG8cnq1uClvHfG9e1Txy6N5nyUfmk9U8B4Kar_H9c0_CVuEpmhi7LXyvjZncNbLyWQ959TJsyc_8zbCQ5F1I-SWoqb9XdDIrnp1T9VabtzW_GFOaDcuypime8kGM_vajQRANGKfHlsM-ThD_XqFBIN-ksJpl6lUdbi5wh0cGEUw1UcY6q_Irt92Urg3LziZ6OllISchoCgI2e62E',
    active: true,
  },
  {
    alt: 'Side profile of luxury watch showing the crown and polished titanium case on a dark surface',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWFKxrcgY7qzycVAyMrZ7RQpbUlx_okF4AeHPHaHa3Q4KCUBC34B3B1XW0LyrVJufaWa0vbiN-udz18P444-BBNoUxKsmmxXLtBvKDng87BJhAtVzi627UKW9Z8C-5rSsK-I3M40-xt6M0ORKqqi9csI0vMHvRYp1MCLMXXG6vqsThzRWse5l5z3cauMVmJV_6OIkdYKcd-a2EDswH4RWIBM3c7aDTh7e-OTd4Xdqe-Fdpx2PMpd37kCXLppVqS_mrhFczaaxeBu4',
  },
  {
    alt: "Watch worn on a person's wrist with blurred architectural background in low evening light",
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLyTHRXUyoE2RoKJhqSE-M3hmzMLUgDeX_LGT3x-Ixw3zIEwrHz1JSKMgchPnzbdIrM2dn9R8X-lwkGUAPqgg8FgoGf3vkMTgX706fkdO5nYfXpF2U4hVHQxpHbYKBWOBA-OhOd3bxLKDhKi2yRJED3S5eFgc7M_AwV46DVbk_sX6BnWsFlLCdl18Ez7qgPTbS9KbZnc9wuFYfsC2Xp-EsknEpw6O4bJrROyLPq_gIHdVuBUJ_Wa1T0uKP6qd1gQw7cgUpbGzuYrM',
  },
  {
    alt: 'Luxury dark wood presentation box with velvet interior and silver hardware',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwe4ew3SmRrMIlPIVGIgQOwqa6yUx5_wLq4BhhdsQei9M4OD5eyALdsB7c_5vTyBBJrXtN2jMNOEcQYW5yUqqjDB73EygRFdEsvAWghvl8rsWY0ZS6L-PEtx8osDg0Q37fvezuGSag4InSCuq433HZ0P9chJSSwVMTfbwB-aES5Vc_6F_SAIGt_bM_Yg05GBejzqnQ_deIGNSay9bv3WAeLLIKYqn4TcmlGp9e8WoP0vXC2eRj4i4Tj2WhbBE3UhcYVPwel3CmaMc',
    extraCount: '+8',
  },
]

const activityFeed = [
  {
    initials: 'JD',
    tone: 'primary',
    user: 'Collector_X',
    time: '2m ago',
    message: 'Placed a bid for ',
    amount: '$440.00',
  },
  {
    initials: 'M',
    tone: 'tertiary',
    user: 'User123',
    time: '1m ago',
    message: 'Placed a bid for ',
    amount: '$450.00',
  },
  {
    initials: 'YOU',
    currentUser: true,
    user: 'You',
    time: 'Just now',
    message: 'Bid ',
    amount: '$460.00',
  },
  {
    initials: 'W',
    muted: true,
    user: 'WatchLover',
    time: '4m ago',
    message: 'Bid ',
    amount: '$435.00',
  },
]

const quickInfo = [
  {
    icon: 'verified_user',
    title: 'Safe Bidding',
    body: 'Escrow protection active on all lots.',
  },
  {
    icon: 'local_shipping',
    title: 'Global Express',
    body: 'White-glove delivery within 5 days.',
  },
]

function LotDetailPage({ navigate }) {
  return (
    <div className="lot-page">
      <div className="lot-toast" role="status" aria-live="polite">
        <span className="material-symbols-outlined lot-toast__icon">
          check_circle
        </span>
        <span>Bid placed successfully!</span>
      </div>

      <header className="lot-topbar">
        <div className="lot-topbar__brand-row">
          <a className="lot-brand" href="/" onClick={navigate('/')}>
            Licit
          </a>

          <nav className="lot-topbar__nav" aria-label="Primary navigation">
            <a
              className="lot-topbar__link lot-topbar__link--active"
              href="/auctions"
              onClick={navigate('/auctions')}
            >
              Live Auctions
            </a>
            <a
              className="lot-topbar__link"
              href="/dashboard"
              onClick={navigate('/dashboard')}
            >
              Dashboard
            </a>
            <a className="lot-topbar__link" href="#">
              Collections
            </a>
          </nav>
        </div>

        <div className="lot-topbar__actions">
          <label className="lot-search" aria-label="Search lots">
            <span className="material-symbols-outlined">search</span>
            <input placeholder="Search lots..." type="search" />
          </label>

          <button className="lot-icon-button" type="button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <button className="lot-icon-button" type="button" aria-label="Account">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="lot-layout">
        <section className="lot-gallery">
          <div className="lot-hero-media">
            <img
              alt="Close-up high-fidelity studio shot of a rare skeleton mechanical watch on dark slate background with dramatic rim lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzqEMjOzvk6k5bT9kYm-Oukhhdq93JHRogJSjfE6rvpSJWZhqVINqDSKQ3hvIvdJsFQ7pItF3bykAfaJNrUAdvM6oPdUrKJKLIl-Q8QUKiizT75lqTazAne0JmQrz93_M5-RXfSLZcD6YwpEAyUpgGen7L-9b08EGam-r1wceiXjKQdCo-bhyKk_zLPOi9-uLLLtUhb4dp1elM1y37wktDAgVp31Ho4W_sF4Z0UNJFAim7reLX0-CuE0o-40YUMh0wVVW2YE050zw"
            />

            <div className="lot-hero-media__badge">
              <span className="lot-hero-media__pulse" aria-hidden="true"></span>
              LIVE AUCTION
            </div>
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
            <h1>Patek Philippe "Nautilus" 5711/1A-010</h1>
            <p>
              Lot #4429 - Rare horizontal embossed dial with sapphire crystal
              case back. Certified original documentation included. Private
              collection provenance.
            </p>

            <div className="lot-meta-card__facts">
              <div className="lot-chip">
                <span className="lot-chip__label">Authenticity</span>
                <span className="lot-chip__value lot-chip__value--verified">
                  Verified
                  <span className="material-symbols-outlined">verified</span>
                </span>
              </div>

              <div className="lot-chip">
                <span className="lot-chip__label">Shipping</span>
                <span className="lot-chip__value">Insured Global</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="lot-sidebar">
          <div className="lot-bid-card">
            <div className="lot-bid-card__glow" aria-hidden="true"></div>

            <div className="lot-bid-card__header">
              <div>
                <span className="lot-bid-card__eyebrow">Current Highest Bid</span>
                <strong>$450.00</strong>
              </div>

              <div className="lot-bid-card__countdown">
                <span>Ending In</span>
                <strong>00:45:12</strong>
              </div>
            </div>

            <div className="lot-bid-card__controls">
              <label className="lot-bid-input" aria-label="Bid amount">
                <span>$</span>
                <input defaultValue="460.00" type="number" />
              </label>

              <button className="lot-bid-button" type="button">
                Place Bid
              </button>

              <p>Enter $455.00 or more to outbid the current leader</p>
            </div>
          </div>

          <div className="lot-activity-card">
            <div className="lot-activity-card__header">
              <h2>Real-time Activity</h2>
              <span className="lot-activity-card__online">
                <span></span>
                142 Online
              </span>
            </div>

            <div className="lot-activity-feed">
              {activityFeed.map((item) => (
                <div
                  key={`${item.user}-${item.time}`}
                  className={`lot-activity-item${
                    item.currentUser ? ' lot-activity-item--current' : ''
                  }${item.muted ? ' lot-activity-item--muted' : ''}`}
                >
                  <div
                    className={`lot-activity-item__avatar${
                      item.currentUser
                        ? ' lot-activity-item__avatar--current'
                        : item.tone
                          ? ` lot-activity-item__avatar--${item.tone}`
                          : ''
                    }`}
                  >
                    {item.initials}
                  </div>

                  <div className="lot-activity-item__body">
                    <div className="lot-activity-item__meta">
                      <span
                        className={`lot-activity-item__user${
                          item.currentUser
                            ? ' lot-activity-item__user--current'
                            : ''
                        }`}
                      >
                        {item.user}
                      </span>
                      <span className="lot-activity-item__time">{item.time}</span>
                    </div>

                    <p>
                      {item.message}
                      <strong>{item.amount}</strong>
                    </p>
                  </div>

                  {item.currentUser ? (
                    <span className="material-symbols-outlined lot-activity-item__check">
                      check_circle
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="lot-comment-box">
              <input placeholder="Post a comment..." type="text" />
              <button type="button" aria-label="Send comment">
                <span className="material-symbols-outlined">send</span>
              </button>
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
            <span>Users watching this lot</span>
          </div>

          <div className="lot-ticker__actions">
            <div className="lot-ticker__divider"></div>
            <div>
              <span className="lot-ticker__label">Last Bid</span>
              <strong>$460.00</strong>
            </div>
            <button type="button">Jump to Top</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LotDetailPage
