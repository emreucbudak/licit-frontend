import AuthLayout from './AuthLayout'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

function AuthPage({
  mode,
  navigate,
  onLogin,
  onLoginChallengeRequested,
  onRegisterRequested,
}) {
  const Form = mode === 'register' ? RegisterForm : LoginForm

  return (
    <AuthLayout mode={mode} navigate={navigate}>
      <Form
        navigate={navigate}
        onLogin={onLogin}
        onLoginChallengeRequested={onLoginChallengeRequested}
        onRegisterRequested={onRegisterRequested}
      />
    </AuthLayout>
  )
}

export default AuthPage
