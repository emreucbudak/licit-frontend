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

function VerifyEmailPage({ email, navigate, onEmailVerified }) {
  const description = email
    ? `${email} adresine 6 haneli bir dogrulama kodu gonderdik. Lutfen asagiya gir.`
    : 'E-posta adresine 6 haneli bir dogrulama kodu gonderdik. Lutfen asagiya gir.'

  const handleVerifyEmail = async (code) => {
    const cleanEmail = String(email || '').trim()

    if (!cleanEmail) {
      throw new Error('E-posta adresi bulunamadi. Lutfen tekrar kayit ol.')
    }

    let response

    try {
      response = await fetch(buildApiUrl('/api/auth/register/verify'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
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

    if (!response.ok || payload?.success === false) {
      throw new Error(getVerifyErrorMessage(payload))
    }

    onEmailVerified?.()
  }

  return (
    <OtpVerificationPage
      description={description}
      icon="mark_email_read"
      navigate={navigate}
      submitLabel="E-postayi Dogrula"
      title="E-postani Dogrula"
      onVerified={handleVerifyEmail}
    />
  )
}

export default VerifyEmailPage
