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
      headerLabel="Ingresa tus datos correspondientes para acceder al sistema. Solo tienes 3 intentos antes de que sea bloqueado."
      // backButtonLabel="No tengo una cuenta"
      backButtonHref="/auth/signup"
    >
      <div className="flex flex-col h-full flex-1 justify-between gap-4">
        <LoginForm />
        <p className="text-center text-sm text-gray-500">
          Si olvidaste tu contraseña o pin de acceso, contacta a un
          administrador.
        </p>
      </div>
    </CardWrapper>
  )
}
