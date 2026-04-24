import AuthPage from './AuthPage'

function RegisterPage({ navigate, onLogin }) {
  return <AuthPage mode="register" navigate={navigate} onLogin={onLogin} />
}

export default RegisterPage
