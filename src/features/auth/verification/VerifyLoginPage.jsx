import OtpVerificationPage from './OtpVerificationPage'
import { buildApiUrl } from '../../../config/runtimeConfig'
import { getApiErrorMessage, readResponsePayload } from '../../../utils/apiError'

function VerifyLoginPage({ email, navigate, temporaryToken, onLoginVerified }) {
  const description = email
    ? `${email} adresine 6 haneli bir giriş kodu gönderdik. Lütfen aşağıya gir.`
    : 'E-posta adresine 6 haneli bir giriş kodu gönderdik. Lütfen aşağıya gir.'

  const handleVerifyLogin = async (code) => {
    const cleanEmail = String(email || '').trim()
    const cleanTemporaryToken = String(temporaryToken || '').trim()

    if (!cleanEmail || !cleanTemporaryToken) {
      throw new Error('Giriş doğrulama oturumu bulunamadı. Lütfen tekrar giriş yap.')
    }

    let response

    try {
      response = await fetch(buildApiUrl('/api/auth/login/verify'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${cleanTemporaryToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          code,
        }),
      })
    } catch {
      throw new Error('Kod doğrulanamadı. Bağlantıyı kontrol edip tekrar dene.')
    }

    const payload = await readResponsePayload(response)

    if (!response.ok) {
      throw new Error(
        getApiErrorMessage(payload, 'Kod doğrulanamadı. Lütfen tekrar dene.'),
      )
    }

    onLoginVerified?.({
      accessToken: payload?.accessToken || '',
      refreshToken: payload?.refreshToken || '',
      expiresAt: payload?.expiresAt || '',
    })
  }

  return (
    <OtpVerificationPage
      description={description}
      icon="lock_open"
      navigate={navigate}
      submitLabel="Girişi Doğrula"
      title="Giriş Kodunu Doğrula"
      onVerified={handleVerifyLogin}
    />
  )
}

export default VerifyLoginPage
