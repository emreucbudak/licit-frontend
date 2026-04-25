import AuthLayout from './AuthLayout'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

function AuthPage({ mode, navigate, onLogin, onRegisterRequested }) {
  const Form = mode === 'register' ? RegisterForm : LoginForm

  return (
    <AuthLayout mode={mode} navigate={navigate}>
      <Form
        navigate={navigate}
        onLogin={onLogin}
        onRegisterRequested={onRegisterRequested}
      />
    </AuthLayout>
  )
}

export default AuthPage
