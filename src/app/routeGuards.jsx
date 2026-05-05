import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function PasswordResetCodeRoute({ passwordResetFlow, children }) {
  if (!passwordResetFlow.email || !passwordResetFlow.temporaryToken) {
    return <Navigate to="/forgot-password" replace />
  }

  return children
}

export function PasswordResetRoute({ passwordResetFlow, children }) {
  if (!passwordResetFlow.email || !passwordResetFlow.temporaryToken) {
    return <Navigate to="/forgot-password" replace />
  }

  if (!passwordResetFlow.codeVerified) {
    return <Navigate to="/verify-identity" replace />
  }

  return children
}

export function EmailVerificationRoute({ emailVerificationFlow, children }) {
  if (!emailVerificationFlow.email) {
    return <Navigate to="/register" replace />
  }

  return children
}

export function LoginVerificationRoute({
  loginVerificationFlow,
  isAuthenticated,
  redirectTo = '/dashboard',
  children,
}) {
  if (isAuthenticated) {
    return <Navigate to={redirectTo || '/dashboard'} replace />
  }

  if (!loginVerificationFlow.email || !loginVerificationFlow.temporaryToken) {
    return <Navigate to="/login" replace />
  }

  return children
}
