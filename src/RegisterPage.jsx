import AuthPage from './AuthPage'

function RegisterPage({ navigate, onLogin, onRegisterRequested }) {
  return (
    <AuthPage
      mode="register"
      navigate={navigate}
      onLogin={onLogin}
      onRegisterRequested={onRegisterRequested}
    />
  )
}

export default RegisterPage
