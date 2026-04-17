import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import LiveAuctionsPage from './LiveAuctionsPage'

function normalizePath(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, '') || '/'

  if (trimmedPath === '/auctions') {
    return '/auctions'
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

  return <LandingPage navigate={navigate} />
}

export default App
