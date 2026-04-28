export const AUTH_STORAGE_KEY = 'licit.authenticated'
export const ACCESS_TOKEN_STORAGE_KEY = 'licit.accessToken'
export const REFRESH_TOKEN_STORAGE_KEY = 'licit.refreshToken'
export const TOKEN_EXPIRES_AT_STORAGE_KEY = 'licit.tokenExpiresAt'

export function isStoredAuthenticated() {
  try {
    return (
      window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
      Boolean(window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY))
    )
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
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')

    if (authResult?.accessToken) {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, authResult.accessToken)
    }

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
