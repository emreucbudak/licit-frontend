import AuthPage from './AuthPage'

function LoginPage({ navigate, onLogin, onLoginChallengeRequested }) {
  return (
    <AuthPage
      mode="login"
      navigate={navigate}
      onLogin={onLogin}
      onLoginChallengeRequested={onLoginChallengeRequested}
    />
  )
}

export default LoginPage
