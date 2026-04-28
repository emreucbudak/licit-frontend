import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import CreateAuctionPage from '../features/auctions/create/CreateAuctionPage'
import LotDetailPage from '../features/auctions/detail/LotDetailPage'
import LiveAuctionsPage from '../features/auctions/live/LiveAuctionsPage'
import LoginPage from '../features/auth/login/LoginPage'
import CreateNewPasswordPage from '../features/auth/password-reset/CreateNewPasswordPage'
import ForgotPasswordPage from '../features/auth/password-reset/ForgotPasswordPage'
import VerifyIdentityPage from '../features/auth/password-reset/VerifyIdentityPage'
import RegisterPage from '../features/auth/register/RegisterPage'
import VerifyEmailPage from '../features/auth/verification/VerifyEmailPage'
import VerifyLoginPage from '../features/auth/verification/VerifyLoginPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import LandingPage from '../features/landing/LandingPage'
import SettingsPage from '../features/settings/SettingsPage'
import { titleForPath } from './pageTitles'
import {
  EmailVerificationRoute,
  LoginVerificationRoute,
  PasswordResetCodeRoute,
  PasswordResetRoute,
  ProtectedRoute,
} from './routeGuards'
import {
  clearAuthentication,
  isStoredAuthenticated,
  storeAuthentication,
} from '../utils/authStorage'

function AppRoutes() {
  const routerNavigate = useNavigate()
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(isStoredAuthenticated)
  const [passwordResetFlow, setPasswordResetFlow] = useState({
    email: '',
    temporaryToken: '',
    expiresAt: '',
    codeVerified: false,
  })
  const [emailVerificationFlow, setEmailVerificationFlow] = useState({
    email: '',
  })
  const [loginVerificationFlow, setLoginVerificationFlow] = useState({
    email: '',
    temporaryToken: '',
    expiresAt: '',
    fromPath: '',
  })

  useEffect(() => {
    document.title = titleForPath(location.pathname)
  }, [location.pathname])

  const navigate = (nextPath, options = {}) => (event) => {
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

    if (nextPath === location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    routerNavigate(nextPath, options)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (authResult) => {
    storeAuthentication(authResult)
    setIsAuthenticated(true)

    const fromPath = loginVerificationFlow.fromPath || location.state?.from?.pathname
    setLoginVerificationFlow({
      email: '',
      temporaryToken: '',
      expiresAt: '',
      fromPath: '',
    })
    routerNavigate(fromPath || '/dashboard', { replace: true })
  }

  const handleLoginChallengeRequested = (result) => {
    setLoginVerificationFlow({
      email: result?.email || '',
      temporaryToken: result?.temporaryToken || '',
      expiresAt: result?.expiresAt || '',
      fromPath: location.state?.from?.pathname || '',
    })
    routerNavigate('/verify-login')
  }

  const handleLogout = () => {
    clearAuthentication()
    setIsAuthenticated(false)
    setLoginVerificationFlow({
      email: '',
      temporaryToken: '',
      expiresAt: '',
      fromPath: '',
    })
    routerNavigate('/login', { replace: true })
  }

  const handlePasswordResetRequested = (result) => {
    const email = typeof result === 'string' ? result : result?.email || ''

    setPasswordResetFlow({
      email,
      temporaryToken: result?.temporaryToken || '',
      expiresAt: result?.expiresAt || '',
      codeVerified: false,
    })
    routerNavigate('/verify-identity')
  }

  const handlePasswordResetCodeResent = (result) => {
    setPasswordResetFlow((currentFlow) => ({
      email: result?.email || currentFlow.email,
      temporaryToken: result?.temporaryToken || '',
      expiresAt: result?.expiresAt || '',
      codeVerified: false,
    }))
  }

  const handleRegisterRequested = (result) => {
    setEmailVerificationFlow({
      email: result?.email || '',
    })
    routerNavigate('/verify-email')
  }

  const handleEmailVerified = () => {
    setEmailVerificationFlow({
      email: '',
    })
    routerNavigate('/login', { replace: true })
  }

  const handlePasswordResetVerified = () => {
    setPasswordResetFlow((currentFlow) => ({
      ...currentFlow,
      codeVerified: Boolean(currentFlow.email && currentFlow.temporaryToken),
    }))
    routerNavigate('/reset-password')
  }

  const handlePasswordResetCompleted = () => {
    setPasswordResetFlow({
      email: '',
      temporaryToken: '',
      expiresAt: '',
      codeVerified: false,
    })
    clearAuthentication()
    setIsAuthenticated(false)
    routerNavigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage navigate={navigate} />} />
      <Route
        path="/login"
        element={
          <LoginPage
            navigate={navigate}
            onLoginChallengeRequested={handleLoginChallengeRequested}
          />
        }
      />
      <Route
        path="/verify-login"
        element={
          <LoginVerificationRoute loginVerificationFlow={loginVerificationFlow}>
            <VerifyLoginPage
              email={loginVerificationFlow.email}
              navigate={navigate}
              temporaryToken={loginVerificationFlow.temporaryToken}
              onLoginVerified={handleLogin}
            />
          </LoginVerificationRoute>
        }
      />
      <Route
        path="/register"
        element={
          <RegisterPage
            navigate={navigate}
            onRegisterRequested={handleRegisterRequested}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage
            navigate={navigate}
            onPasswordResetRequested={handlePasswordResetRequested}
          />
        }
      />
      <Route path="/forgot" element={<Navigate to="/forgot-password" replace />} />
      <Route
        path="/verify-identity"
        element={
          <PasswordResetCodeRoute passwordResetFlow={passwordResetFlow}>
            <VerifyIdentityPage
              email={passwordResetFlow.email}
              navigate={navigate}
              temporaryToken={passwordResetFlow.temporaryToken}
              onPasswordResetCodeResent={handlePasswordResetCodeResent}
              onPasswordResetVerified={handlePasswordResetVerified}
            />
          </PasswordResetCodeRoute>
        }
      />
      <Route
        path="/verify-code"
        element={<Navigate to="/verify-identity" replace />}
      />
      <Route
        path="/verify-email"
        element={
          <EmailVerificationRoute emailVerificationFlow={emailVerificationFlow}>
            <VerifyEmailPage
              email={emailVerificationFlow.email}
              navigate={navigate}
              onEmailVerified={handleEmailVerified}
            />
          </EmailVerificationRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PasswordResetRoute passwordResetFlow={passwordResetFlow}>
            <CreateNewPasswordPage
              navigate={navigate}
              temporaryToken={passwordResetFlow.temporaryToken}
              onPasswordResetCompleted={handlePasswordResetCompleted}
            />
          </PasswordResetRoute>
        }
      />
      <Route
        path="/create-new-password"
        element={<Navigate to="/reset-password" replace />}
      />
      <Route
        path="/auctions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LiveAuctionsPage navigate={navigate} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auctions/lot-4429"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LotDetailPage navigate={navigate} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auctions/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateAuctionPage navigate={navigate} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage navigate={navigate} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SettingsPage navigate={navigate} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
