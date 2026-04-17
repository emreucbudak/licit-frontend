import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import LiveAuctionsPage from './LiveAuctionsPage'
import LotDetailPage from './LotDetailPage'
import DashboardPage from './DashboardPage'

function normalizePath(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, '') || '/'

  if (trimmedPath === '/auctions') {
    return '/auctions'
  }

  if (trimmedPath === '/auctions/lot-4429') {
    return '/auctions/lot-4429'
  }

  if (trimmedPath === '/dashboard') {
    return '/dashboard'
  }

  return '/'
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    document.title =
      path === '/auctions'
        ? 'Licit | Premium Auction Exchange'
        : path === '/auctions/lot-4429'
          ? 'Licit | Auction Lot Detail'
          : path === '/dashboard'
            ? 'Licit Dashboard - Collector'
          : 'Licit - Real-time Bidding Platform'
  }, [path])

  const navigate = (nextPath) => (event) => {
    if (
      event &&
      (event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey)
    ) {
      return
    }

    event?.preventDefault()

    if (normalizePath(nextPath) === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(normalizePath(nextPath))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (path === '/auctions') {
    return <LiveAuctionsPage navigate={navigate} />
  }

  if (path === '/auctions/lot-4429') {
    return <LotDetailPage navigate={navigate} />
  }

  if (path === '/dashboard') {
    return <DashboardPage navigate={navigate} />
  }

  return <LandingPage navigate={navigate} />
}

export default App
