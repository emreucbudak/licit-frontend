import './AppNavigation.css'

const sideNavLinks = [
  {
    label: 'Canlı Müzayedeler',
    icon: 'gavel',
    href: '/auctions',
    route: true,
    match: ['/auctions', '/auctions/lot-4429'],
  },
  {
    label: 'Panel',
    icon: 'dashboard',
    href: '/dashboard',
    route: true,
    match: ['/dashboard'],
  },
  { label: 'Koleksiyonlar', icon: 'category', href: '#' },
  { label: 'Cüzdan', icon: 'account_balance_wallet', href: '#' },
  {
    label: 'Ayarlar',
    icon: 'settings',
    href: '/settings',
    route: true,
    match: ['/settings'],
  },
]

const footerNavLinks = [
  { label: 'Yardım Merkezi', icon: 'help', href: '#' },
  { label: 'Çıkış Yap', icon: 'logout', href: '#' },
]

function isActive(currentPath, link) {
  return link.match?.includes(currentPath)
}

function routeHandler(navigate, link) {
  return link.route ? navigate(link.href) : undefined
}

export function AppTopNavbar({ currentPath, navigate, searchPlaceholder = 'Müzayede ara...' }) {
  return (
    <header className="app-topbar">
      <div className="app-topbar__brand-row">
        <a className="app-brand" href="/" onClick={navigate('/')}>
          Licit
        </a>
      </div>

      <div className="app-topbar__actions">
        <label className="app-search" aria-label="Müzayede ara">
          <span className="material-symbols-outlined">search</span>
          <input placeholder={searchPlaceholder} type="search" />
        </label>

        <button
          className={`app-icon-button${
            currentPath === '/auctions' ? ' app-icon-button--live' : ''
          }`}
          type="button"
          aria-label="Bildirimler"
        >
          <span className="material-symbols-outlined">notifications</span>
          {currentPath === '/auctions' ? (
            <span className="app-icon-button__dot" aria-hidden="true"></span>
          ) : null}
        </button>

        <button className="app-icon-button" type="button" aria-label="Hesap">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}

export function AppSideNavbar({ currentPath, navigate }) {
  const createAuctionActive = currentPath === '/auctions/create'

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__profile">
        <div className="app-sidebar__avatar">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div>
          <p>Koleksiyoner</p>
          <span>Doğrulanmış Üye</span>
        </div>
      </div>

      <nav className="app-sidebar__nav" aria-label="Yan navigasyon">
        {sideNavLinks.map((link) => (
          <a
            key={link.label}
            className={`app-sidebar__link${
              isActive(currentPath, link) ? ' app-sidebar__link--active' : ''
            }`}
            href={link.href}
            onClick={routeHandler(navigate, link)}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <a
        className={`app-sidebar__cta${
          createAuctionActive ? ' app-sidebar__cta--active' : ''
        }`}
        href="/auctions/create"
        onClick={navigate('/auctions/create')}
      >
        <span className="material-symbols-outlined">add_circle</span>
        Müzayede Oluştur
      </a>

      <nav className="app-sidebar__footer" aria-label="Hesap navigasyonu">
        {footerNavLinks.map((link) => (
          <a key={link.label} className="app-sidebar__link" href={link.href}>
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
