import { getStoredAuthTokens, storeAuthentication } from '../auth/authStorage'
import { getApiErrorMessage, readResponsePayload } from './apiError'
import { buildApiUrl } from '../config/runtimeConfig'

export async function refreshAccessToken() {
  const { refreshToken } = getStoredAuthTokens()

  if (!refreshToken) {
    throw new Error('Oturum suresi doldu. Lutfen tekrar giris yap.')
  }

  const response = await fetch(buildApiUrl('/api/auth/refresh'), {
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
        'Oturum yenilenemedi. Lutfen tekrar giris yap.',
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
    const response = await fetch(buildApiUrl('/api/auth/revoke'), {
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
    throw new Error('Oturum bulunamadi. Lutfen tekrar giris yap.')
  }

  const isFormData = body instanceof FormData

  const sendRequest = (token) =>
    fetch(buildApiUrl(path), {
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
