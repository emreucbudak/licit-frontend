import OtpVerificationPage from './OtpVerificationPage'
import { buildApiUrl } from '../../../config/runtimeConfig'
import { getApiErrorMessage, readResponsePayload } from '../../../utils/apiError'

function VerifyEmailPage({ email, navigate, onEmailVerified }) {
  const description = email
    ? `${email} adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya gir.`
    : 'E-posta adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya gir.'

  const handleVerifyEmail = async (code) => {
    const cleanEmail = String(email || '').trim()

    if (!cleanEmail) {
      throw new Error('E-posta adresi bulunamadı. Lütfen tekrar kayıt ol.')
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
      throw new Error('Kod doğrulanamadı. Bağlantıyı kontrol edip tekrar dene.')
    }

    const payload = await readResponsePayload(response)

    if (!response.ok || payload?.success === false) {
      throw new Error(
        getApiErrorMessage(payload, 'Kod doğrulanamadı. Lütfen tekrar dene.'),
      )
    }

    onEmailVerified?.()
  }

  return (
    <OtpVerificationPage
      description={description}
      icon="mark_email_read"
      navigate={navigate}
      submitLabel="E-postayı Doğrula"
      title="E-postanı Doğrula"
      onVerified={handleVerifyEmail}
    />
  )
}

export default VerifyEmailPage
