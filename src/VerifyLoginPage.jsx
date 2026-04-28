import OtpVerificationPage from './OtpVerificationPage'
import { buildApiUrl } from './config/runtimeConfig'

async function readVerifyPayload(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function getVerifyErrorMessage(payload) {
  const fallbackMessage = 'Kod dogrulanamadi. Lutfen tekrar dene.'
  const validationMessage = payload?.errors
    ?.map((error) => error.errorMessage || error.message)
    .filter(Boolean)
    .join(' ')

  return validationMessage || payload?.message || fallbackMessage
}

function VerifyLoginPage({ email, navigate, temporaryToken, onLoginVerified }) {
  const description = email
    ? `${email} adresine 6 haneli bir giris kodu gonderdik. Lutfen asagiya gir.`
    : 'E-posta adresine 6 haneli bir giris kodu gonderdik. Lutfen asagiya gir.'

  const handleVerifyLogin = async (code) => {
    const cleanEmail = String(email || '').trim()
    const cleanTemporaryToken = String(temporaryToken || '').trim()

    if (!cleanEmail || !cleanTemporaryToken) {
      throw new Error('Giris dogrulama oturumu bulunamadi. Lutfen tekrar giris yap.')
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
      throw new Error('Kod dogrulanamadi. Baglantiyi kontrol edip tekrar dene.')
    }

    const payload = await readVerifyPayload(response)

    if (!response.ok) {
      throw new Error(getVerifyErrorMessage(payload))
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
      submitLabel="Girisi Dogrula"
      title="Giris Kodunu Dogrula"
      onVerified={handleVerifyLogin}
    />
  )
}

export default VerifyLoginPage
