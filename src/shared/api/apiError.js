const DEFAULT_FALLBACK_MESSAGE = 'İşlem tamamlanamadı. Lütfen tekrar dene.'
const DOWNSTREAM_CLUSTER_ERROR_PATTERN =
  /\b(?:InternalServerError|BadGateway|ServiceUnavailable|GatewayTimeout)\s+from\s+[-\w]+-cluster\.?/i
const NETWORK_ERROR_PATTERN =
  /\b(?:Failed to fetch|NetworkError|Network request failed|Load failed|ERR_NETWORK|ECONNREFUSED|ENOTFOUND|CORS)\b/i
const SERVER_ERROR_PATTERN =
  /\b(?:Internal Server Error|HTTP 500|Status Code 500|500 Internal|An error occurred while processing your request)\b/i
const CLIENT_TECHNICAL_ERROR_PATTERN =
  /\b(?:TypeError|ReferenceError|SyntaxError|Unexpected token|JSON|Cannot read properties|Cannot read property)\b/i

export async function readResponsePayload(response) {
  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (response && !response.ok) {
    logApiFailure({
      payload,
      response,
      source: 'api-response',
    })
  }

  return payload
}

export function getApiErrorMessage(payload, fallbackMessage = DEFAULT_FALLBACK_MESSAGE) {
  const validationMessage = getValidationMessage(payload?.errors)

  return normalizeApiErrorMessage(
    validationMessage || payload?.message || payload?.detail || payload?.title,
    fallbackMessage,
  )
}

function getValidationMessage(errors) {
  if (!errors) {
    return ''
  }

  if (Array.isArray(errors)) {
    return errors
      .map((error) => error?.errorMessage || error?.message || error)
      .filter(Boolean)
      .join(' ')
  }

  if (typeof errors === 'object') {
    return Object.values(errors)
      .flat()
      .filter(Boolean)
      .join(' ')
  }

  return String(errors)
}

export function normalizeApiErrorMessage(
  message,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
) {
  if (!message) {
    return fallbackMessage
  }

  const normalizedMessage = String(message)

  if (NETWORK_ERROR_PATTERN.test(normalizedMessage)) {
    return 'Sunucuya ulaşılamadı. Lütfen bağlantını kontrol edip tekrar dene.'
  }

  if (DOWNSTREAM_CLUSTER_ERROR_PATTERN.test(message)) {
    return 'Servis verisi şu anda alınamadı. Lütfen birazdan tekrar dene.'
  }

  if (SERVER_ERROR_PATTERN.test(normalizedMessage)) {
    return fallbackMessage
  }

  if (CLIENT_TECHNICAL_ERROR_PATTERN.test(normalizedMessage)) {
    return fallbackMessage
  }

  return normalizedMessage
}

export function getUserFacingErrorMessage(
  error,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
) {
  const message =
    typeof error === 'string'
      ? error
      : error?.userMessage || error?.message || error?.toString?.()

  return normalizeApiErrorMessage(message, fallbackMessage)
}

export function logApiFailure({
  error,
  method,
  path,
  payload,
  response,
  source = 'api',
} = {}) {
  if (typeof console === 'undefined') {
    return
  }

  const status = response?.status
  const statusText = response?.statusText
  const url = path || response?.url || ''
  const safePayload = payload ?? null

  console.groupCollapsed(
    `[Licit API] ${source} failed${status ? ` ${status}` : ''}${url ? ` ${url}` : ''}`,
  )
  console.error('request', {
    method: method || 'GET',
    url,
    status,
    statusText,
  })

  if (safePayload !== null) {
    console.error('payload', safePayload)
  }

  if (error) {
    console.error('error', error)
  }

  console.groupEnd()
}

export async function readApiErrorMessage(
  response,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE
) {
  const payload = await readResponsePayload(response)

  return getApiErrorMessage(payload, fallbackMessage)
}
