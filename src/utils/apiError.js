const DEFAULT_FALLBACK_MESSAGE = 'İşlem tamamlanamadı. Lütfen tekrar dene.'

export async function readResponsePayload(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export function getApiErrorMessage(payload, fallbackMessage = DEFAULT_FALLBACK_MESSAGE) {
  const validationMessage = payload?.errors
    ?.map((error) => error.errorMessage || error.message)
    .filter(Boolean)
    .join(' ')

  return validationMessage || payload?.message || fallbackMessage
}

export async function readApiErrorMessage(
  response,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE
) {
  const payload = await readResponsePayload(response)

  return getApiErrorMessage(payload, fallbackMessage)
}
