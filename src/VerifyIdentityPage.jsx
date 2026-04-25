import OtpVerificationPage from './OtpVerificationPage'

function VerifyIdentityPage({ navigate, onPasswordResetVerified }) {
  return (
    <OtpVerificationPage
      description="E-posta adresine 6 haneli bir dogrulama kodu gonderdik. Lutfen asagiya gir."
      icon="lock_open"
      navigate={navigate}
      title="Kimligini Dogrula"
      onVerified={onPasswordResetVerified}
    />
  )
}

export default VerifyIdentityPage
