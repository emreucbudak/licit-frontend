import { useEffect, useState } from 'react'
import './AppNavigation.css'

const sideNavLinks = [
  {
    label: 'Canl\u0131 M\u00fczayedeler',
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
  {
    label: 'C\u00fczdan',
    icon: 'account_balance_wallet',
    href: '/wallet',
    route: true,
    match: ['/wallet'],
  },
  {
    label: 'Ayarlar',
    icon: 'settings',
    href: '/settings',
    route: true,
    match: ['/settings'],
  },
]

const footerNavLinks = [
  { label: 'Yard\u0131m Merkezi', icon: 'help', href: '#' },
  {
    label: '\u00c7\u0131k\u0131\u015f Yap',
    icon: 'logout',
    href: '/login',
    action: 'logout',
  },
]

function isActive(currentPath, link) {
  return link.match?.includes(currentPath)
}

function routeHandler(navigate, link) {
  return link.route ? navigate(link.href) : undefined
}

export function AppTopNavbar({
  currentPath,
  navigate,
  searchPlaceholder = 'M\u00fczayede ara...',
  searchValue = '',
}) {
  const [searchTerm, setSearchTerm] = useState(searchValue)

  useEffect(() => {
    setSearchTerm(searchValue)
  }, [searchValue])

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const trimmedSearch = searchTerm.trim()
    const searchPath = trimmedSearch
      ? `/auctions?search=${encodeURIComponent(trimmedSearch)}`
      : '/auctions'

    navigate(searchPath)(event)
  }

  return (
    <header className="app-topbar">
      <div className="app-topbar__brand-row">
        <a className="app-brand" href="/" onClick={navigate('/')}>
          Licit
        </a>
      </div>

      <div className="app-topbar__actions">
        <form className="app-search" aria-label="M\u00fczayede ara" onSubmit={handleSearchSubmit}>
          <span className="material-symbols-outlined">search</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={searchTerm}
          />
        </form>

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

export function AppSideNavbar({ currentPath, navigate, onLogout }) {
  const createAuctionActive = currentPath === '/auctions/create'

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__profile">
        <div className="app-sidebar__avatar">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div>
          <p>Koleksiyoner</p>
          <span>{'Do\u011frulanm\u0131\u015f \u00dcye'}</span>
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
        {'M\u00fczayede Olu\u015ftur'}
      </a>

      <nav className="app-sidebar__footer" aria-label="Hesap navigasyonu">
        {footerNavLinks.map((link) => (
          <a
            key={link.label}
            className="app-sidebar__link"
            href={link.href}
            onClick={
              link.action === 'logout'
                ? (event) => {
                    event.preventDefault()
                    onLogout?.()
                  }
                : undefined
            }
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
