import OtpVerificationPage from '../verification/OtpVerificationPage'

function VerifyIdentityPage({ navigate, onPasswordResetVerified }) {
  return (
    <OtpVerificationPage
      description="E-posta adresine 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya gir."
      icon="lock_open"
      navigate={navigate}
      title="Kimliğini Doğrula"
      onVerified={onPasswordResetVerified}
    />
  )
}

export default VerifyIdentityPage
