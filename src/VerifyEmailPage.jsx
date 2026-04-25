import OtpVerificationPage from './OtpVerificationPage'

function VerifyEmailPage({ email, navigate, onEmailVerified }) {
  const description = email
    ? `${email} adresine 6 haneli bir dogrulama kodu gonderdik. Lutfen asagiya gir.`
    : 'E-posta adresine 6 haneli bir dogrulama kodu gonderdik. Lutfen asagiya gir.'

  return (
    <OtpVerificationPage
      description={description}
      icon="mark_email_read"
      navigate={navigate}
      submitLabel="E-postayi Dogrula"
      title="E-postani Dogrula"
      onVerified={onEmailVerified}
    />
  )
}

export default VerifyEmailPage
