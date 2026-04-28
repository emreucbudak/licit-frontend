function normalizeBaseUrl(value) {
  return String(value || '').replace(/\/+$/, '')
}

export const runtimeConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  wsBaseUrl: normalizeBaseUrl(import.meta.env.VITE_WS_BASE_URL),
}

export function buildApiUrl(path) {
  const cleanPath = String(path || '')

  if (!runtimeConfig.apiBaseUrl) {
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  }

  return `${runtimeConfig.apiBaseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`
}

export function buildWsUrl(path) {
  const cleanPath = String(path || '')

  if (!runtimeConfig.wsBaseUrl) {
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  }

  return `${runtimeConfig.wsBaseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`
}
