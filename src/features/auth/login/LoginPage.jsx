import AuthLayout from '../layout/AuthLayout'
import LoginForm from './LoginForm'

function LoginPage({ navigate, onLoginChallengeRequested }) {
  return (
    <AuthLayout mode="login" navigate={navigate}>
      <LoginForm
        navigate={navigate}
        onLoginChallengeRequested={onLoginChallengeRequested}
      />
    </AuthLayout>
  )
}

export default LoginPage
