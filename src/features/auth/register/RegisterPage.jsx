import AuthLayout from '../layout/AuthLayout'
import RegisterForm from './RegisterForm'

function RegisterPage({ navigate, onRegisterRequested }) {
  return (
    <AuthLayout mode="register" navigate={navigate}>
      <RegisterForm
        navigate={navigate}
        onRegisterRequested={onRegisterRequested}
      />
    </AuthLayout>
  )
}

export default RegisterPage
