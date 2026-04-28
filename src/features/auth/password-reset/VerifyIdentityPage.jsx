import OtpVerificationPage from '../verification/OtpVerificationPage'
import { buildApiUrl } from '../../../shared/config/runtimeConfig'
import { getApiErrorMessage, readResponsePayload } from '../../../shared/api/apiError'

function VerifyIdentityPage({
  email,
  navigate,
  temporaryToken,
  onPasswordResetCodeResent,
  onPasswordResetVerified,
}) {
  const description = email
    ? `${email} adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya gir.`
    : 'E-posta adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya gir.'

  const handleVerifyIdentity = async (code) => {
    const cleanTemporaryToken = String(temporaryToken || '').trim()

    if (!cleanTemporaryToken) {
      throw new Error('Şifre sıfırlama oturumu bulunamadı. Lütfen tekrar dene.')
    }

    let response

    try {
      response = await fetch(buildApiUrl('/api/auth/forgot-password/verify'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temporaryToken: cleanTemporaryToken,
          code,
        }),
      })
    } catch {
      throw new Error('Kod doğrulanamadı. Bağlantıyı kontrol edip tekrar dene.')
    }

    const payload = await readResponsePayload(response)

    if (!response.ok || payload?.isVerified === false) {
      throw new Error(
        getApiErrorMessage(payload, 'Kod doğrulanamadı. Lütfen tekrar dene.'),
      )
    }

    onPasswordResetVerified?.()
  }

  const handleResendCode = async () => {
    const cleanEmail = String(email || '').trim()

    if (!cleanEmail) {
      throw new Error('E-posta adresi bulunamadı. Lütfen tekrar dene.')
    }

    let response

    try {
      response = await fetch(buildApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
        }),
      })
    } catch {
      throw new Error('Kod tekrar gönderilemedi. Bağlantıyı kontrol edip tekrar dene.')
    }

    const payload = await readResponsePayload(response)

    if (!response.ok || !payload?.temporaryToken) {
      throw new Error(
        getApiErrorMessage(
          payload,
          'Kod tekrar gönderilemedi. Lütfen tekrar dene.',
        ),
      )
    }

    onPasswordResetCodeResent?.({
      email: payload?.email || cleanEmail,
      temporaryToken: payload.temporaryToken,
      expiresAt: payload?.expiresAt || '',
    })
  }

  return (
    <OtpVerificationPage
      description={description}
      icon="lock_open"
      navigate={navigate}
      title="Kimliğini Doğrula"
      onResend={handleResendCode}
      onVerified={handleVerifyIdentity}
    />
  )
}

export default VerifyIdentityPage
