import { useEffect, useState } from 'react'
import LandingPage from './LandingPage'
import LiveAuctionsPage from './LiveAuctionsPage'
import LotDetailPage from './LotDetailPage'
import DashboardPage from './DashboardPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import CreateAuctionPage from './CreateAuctionPage'
import SettingsPage from './SettingsPage'
import CreateNewPasswordPage from './CreateNewPasswordPage'
import VerifyIdentityPage from './VerifyIdentityPage'
import ForgotPasswordPage from './ForgotPasswordPage'

const AUTH_STORAGE_KEY = 'licit.authenticated'

const protectedPaths = new Set([
  '/auctions',
  '/auctions/lot-4429',
  '/auctions/create',
  '/dashboard',
  '/settings',
])

function isProtectedPath(pathname) {
  return protectedPaths.has(pathname)
}

function isStoredAuthenticated() {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function storeAuthentication() {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
  } catch {
    // Backend auth will replace this temporary local flag.
  }
}

function clearAuthentication() {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Backend auth will replace this temporary local flag.
  }
}

function normalizePath(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, '') || '/'

  if (trimmedPath === '/auctions') {
    return '/auctions'
  }

  if (trimmedPath === '/auctions/lot-4429') {
    return '/auctions/lot-4429'
  }

  if (trimmedPath === '/auctions/create') {
    return '/auctions/create'
  }

  if (trimmedPath === '/dashboard') {
    return '/dashboard'
  }

  if (trimmedPath === '/settings') {
    return '/settings'
  }

  if (trimmedPath === '/login') {
    return '/login'
  }

  if (trimmedPath === '/forgot-password' || trimmedPath === '/forgot') {
    return '/forgot-password'
  }

  if (trimmedPath === '/verify-identity' || trimmedPath === '/verify-code') {
    return '/verify-identity'
  }

  if (
    trimmedPath === '/reset-password' ||
    trimmedPath === '/create-new-password'
  ) {
    return '/reset-password'
  }

  if (trimmedPath === '/register') {
    return '/register'
  }

  return '/'
}

function titleForPath(pathname) {
  return (
    {
      '/auctions': 'Licit | Premium Auction Exchange',
      '/auctions/lot-4429': 'Licit | Lot Detayi',
      '/auctions/create': 'Muzayede Olustur | Licit',
      '/dashboard': 'Licit Panel - Koleksiyoner',
      '/settings': 'Hesap Ayarlari | Licit',
      '/login': 'Giris Yap - Licit',
      '/forgot-password': 'Sifremi Unuttum | Licit',
      '/verify-identity': 'Kimligini Dogrula | Licit',
      '/reset-password': 'Yeni Sifre Olustur | Licit',
      '/register': 'Kaydol - Licit',
    }[pathname] || 'Licit - Real-time Bidding Platform'
  )
}

function resolveRenderedPath(pathname, isAuthenticated, passwordResetFlow) {
  if (!isAuthenticated && isProtectedPath(pathname)) {
    return '/login'
  }

  if (pathname === '/verify-identity' && !passwordResetFlow.email) {
    return '/forgot-password'
  }

  if (pathname === '/reset-password') {
    if (!passwordResetFlow.email) {
      return '/forgot-password'
    }

    if (!passwordResetFlow.codeVerified) {
      return '/verify-identity'
    }
  }

  return pathname
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const [isAuthenticated, setIsAuthenticated] = useState(isStoredAuthenticated)
  const [passwordResetFlow, setPasswordResetFlow] = useState({
    email: '',
    codeVerified: false,
  })

  const renderedPath = resolveRenderedPath(
    path,
    isAuthenticated,
    passwordResetFlow,
  )

  const setRoute = (nextPath, options = {}) => {
    const normalizedPath = normalizePath(nextPath)

    if (normalizedPath === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (options.replace === true) {
      window.history.replaceState({}, '', normalizedPath)
    } else {
      window.history.pushState({}, '', normalizedPath)
    }

    setPath(normalizedPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
    document.title = titleForPath(renderedPath)
  }, [renderedPath])

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
    setRoute(nextPath)
  }

  const handleLogin = () => {
    storeAuthentication()
    setIsAuthenticated(true)

    if (!isProtectedPath(path)) {
      setRoute('/dashboard', { replace: true })
    }
  }

  const handleLogout = () => {
    clearAuthentication()
    setIsAuthenticated(false)
    setRoute('/login', { replace: true })
  }

  const handlePasswordResetRequested = (email) => {
    setPasswordResetFlow({
      email,
      codeVerified: false,
    })
    setRoute('/verify-identity')
  }

  const handlePasswordResetVerified = () => {
    setPasswordResetFlow((currentFlow) => ({
      ...currentFlow,
      codeVerified: Boolean(currentFlow.email),
    }))
    setRoute('/reset-password')
  }

  const handlePasswordResetCompleted = () => {
    setPasswordResetFlow({
      email: '',
      codeVerified: false,
    })
    clearAuthentication()
    setIsAuthenticated(false)
    setRoute('/login', { replace: true })
  }

  if (renderedPath === '/auctions') {
    return <LiveAuctionsPage navigate={navigate} onLogout={handleLogout} />
  }

  if (renderedPath === '/auctions/lot-4429') {
    return <LotDetailPage navigate={navigate} />
  }

  if (renderedPath === '/auctions/create') {
    return <CreateAuctionPage navigate={navigate} onLogout={handleLogout} />
  }

  if (renderedPath === '/dashboard') {
    return <DashboardPage navigate={navigate} onLogout={handleLogout} />
  }

  if (renderedPath === '/settings') {
    return <SettingsPage navigate={navigate} onLogout={handleLogout} />
  }

  if (renderedPath === '/login') {
    return <LoginPage navigate={navigate} onLogin={handleLogin} />
  }

  if (renderedPath === '/forgot-password') {
    return (
      <ForgotPasswordPage
        navigate={navigate}
        onPasswordResetRequested={handlePasswordResetRequested}
      />
    )
  }

  if (renderedPath === '/verify-identity') {
    return (
      <VerifyIdentityPage
        navigate={navigate}
        onPasswordResetVerified={handlePasswordResetVerified}
      />
    )
  }

  if (renderedPath === '/reset-password') {
    return (
      <CreateNewPasswordPage
        navigate={navigate}
        onPasswordResetCompleted={handlePasswordResetCompleted}
      />
    )
  }

  if (renderedPath === '/register') {
    return <RegisterPage navigate={navigate} onLogin={handleLogin} />
  }

  return <LandingPage navigate={navigate} />
}

export default App
