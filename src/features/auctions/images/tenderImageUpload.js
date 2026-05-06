import { sendAuthorizedRequest } from '../../../shared/api/authorizedRequest'

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageSizeBytes = 5 * 1024 * 1024

export function validateTenderImageFile(file) {
  if (!file) {
    return ''
  }

  if (!allowedImageTypes.has(file.type)) {
    return 'Yalnızca JPG, PNG veya WEBP görsel yükleyebilirsin.'
  }

  if (file.size > maxImageSizeBytes) {
    return 'Görsel en fazla 5 MB olabilir.'
  }

  return ''
}

export async function uploadTenderImage(tenderId, file) {
  const validationError = validateTenderImageFile(file)
  if (validationError) {
    throw new Error(validationError)
  }

  const formData = new FormData()
  formData.append('file', file)

  return sendAuthorizedRequest(`/api/tender/${tenderId}/image`, {
    body: formData,
    method: 'POST',
  })
}
