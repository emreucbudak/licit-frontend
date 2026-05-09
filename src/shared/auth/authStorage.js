export const AUTH_STORAGE_KEY = 'licit.authenticated'
export const ACCESS_TOKEN_STORAGE_KEY = 'licit.accessToken'
export const REFRESH_TOKEN_STORAGE_KEY = 'licit.refreshToken'
export const TOKEN_EXPIRES_AT_STORAGE_KEY = 'licit.tokenExpiresAt'

const AUTH_EXPIRY_SKEW_MS = 30_000

function decodeBase64Url(value) {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    '=',
  )

  return window.atob(paddedValue)
}

function readAccessTokenExpiry(accessToken) {
  try {
    const [, payload] = accessToken.split('.')

    if (!payload) {
      return null
    }

    const parsedPayload = JSON.parse(decodeBase64Url(payload))
    const expirySeconds = Number(parsedPayload.exp)

    return Number.isFinite(expirySeconds) ? expirySeconds * 1000 : null
  } catch {
    return null
  }
}

function readStoredExpiry(expiresAt) {
  if (!expiresAt) {
    return null
  }

  const expiryTime = new Date(expiresAt).getTime()

  return Number.isFinite(expiryTime) ? expiryTime : null
}

function isFutureExpiry(expiryTime) {
  return expiryTime === null || expiryTime - AUTH_EXPIRY_SKEW_MS > Date.now()
}

function hasUsableAccessToken(accessToken, expiresAt) {
  if (!accessToken) {
    return false
  }

  const storedExpiry = readStoredExpiry(expiresAt)
  const tokenExpiry = readAccessTokenExpiry(accessToken)

  return isFutureExpiry(storedExpiry) && isFutureExpiry(tokenExpiry)
}

export function isStoredAuthenticated() {
  try {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || ''
    const expiresAt = window.localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY) || ''
    const isAuthenticated = hasUsableAccessToken(accessToken, expiresAt)

    if (!isAuthenticated) {
      clearAuthentication()
    }

    return isAuthenticated
  } catch {
    return false
  }
}

export function getStoredAuthTokens() {
  try {
    return {
      accessToken: window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || '',
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || '',
      expiresAt: window.localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY) || '',
    }
  } catch {
    return {
      accessToken: '',
      refreshToken: '',
      expiresAt: '',
    }
  }
}

export function storeAuthentication(authResult) {
  try {
    if (!authResult?.accessToken) {
      clearAuthentication()
      return
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')

    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authResult.accessToken)

    if (authResult?.refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, authResult.refreshToken)
    }

    if (authResult?.expiresAt) {
      window.localStorage.setItem(TOKEN_EXPIRES_AT_STORAGE_KEY, authResult.expiresAt)
    }
  } catch {
    // Auth state can still be held in memory when storage is unavailable.
  }
}

export function clearAuthentication() {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY)
  } catch {
    // Auth state can still be cleared in memory when storage is unavailable.
  }
}
