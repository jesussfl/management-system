import { Metadata } from 'next'
import LoginForm from '@/app/(auth)/components/login-form'
import { CardWrapper } from '@/app/(auth)/components/card-wrapper'

export const metadata: Metadata = {
  title: 'Inicio de sesión',
  description: 'Inicia sesion en tu cuenta',
}

export default function Page() {
  return (
    <CardWrapper
      headerTitle="Inicia sesión"
      headerLabel="Ingresa tus datos correspondientes para acceder al sistema."
      backButtonLabel="No tengo una cuenta"
      backButtonHref="/auth/signup"
      showSocial
    >
      <LoginForm />
    </CardWrapper>
  )
}
