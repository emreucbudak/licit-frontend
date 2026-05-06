import { getStoredAuthTokens, storeAuthentication } from '../auth/authStorage'
import { getApiErrorMessage, logApiFailure, readResponsePayload } from './apiError'
import { buildApiUrl } from '../config/runtimeConfig'

async function fetchWithApiLogging(path, options = {}) {
  const method = options.method || 'GET'
  const url = buildApiUrl(path)

  try {
    return await fetch(url, options)
  } catch (error) {
    logApiFailure({
      error,
      method,
      path: url,
      source: 'network',
    })
    throw error
  }
}

export async function refreshAccessToken() {
  const { refreshToken } = getStoredAuthTokens()

  if (!refreshToken) {
    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yap.')
  }

  const response = await fetchWithApiLogging('/api/auth/refresh', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  })
  const payload = await readResponsePayload(response)

  if (!response.ok || !payload?.accessToken) {
    throw new Error(
      getApiErrorMessage(
        payload,
        'Oturum yenilenemedi. Lütfen tekrar giriş yap.',
      ),
    )
  }

  storeAuthentication(payload)
  return payload.accessToken
}

export async function revokeStoredRefreshToken() {
  const { accessToken, refreshToken } = getStoredAuthTokens()

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetchWithApiLogging('/api/auth/revoke', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    })

    return response.ok
  } catch {
    return false
  }
}

export async function sendAuthorizedRequest(
  path,
  { body, headers = {}, method = 'GET' } = {},
) {
  const { accessToken } = getStoredAuthTokens()

  if (!accessToken) {
    throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yap.')
  }

  const isFormData = body instanceof FormData

  const sendRequest = (token) =>
    fetchWithApiLogging(path, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(body === undefined || isFormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(body === undefined
        ? {}
        : { body: isFormData ? body : JSON.stringify(body) }),
    })

  let response = await sendRequest(accessToken)

  if (response.status === 401) {
    response = await sendRequest(await refreshAccessToken())
  }

  return {
    payload: await readResponsePayload(response),
    response,
  }
}
