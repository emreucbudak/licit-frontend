import AuthPage from './AuthPage'

function LoginPage({ navigate, onLogin }) {
  return <AuthPage mode="login" navigate={navigate} onLogin={onLogin} />
}

export default LoginPage
