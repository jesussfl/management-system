import { Metadata } from 'next'
import { SignupForm } from '@/modules/auth/templates/signup-form'
import { CardWrapper } from '@/modules/auth/components/card-wrapper'
export const metadata: Metadata = {
  title: 'Registro',
  description: ' Ingresa tus datos para crear tu cuenta',
}

export default function Page() {
  return (
    <CardWrapper
      headerTitle="Registro"
      headerLabel="Ingresa tus datos para crear tu cuenta"
      backButtonLabel="Ya tengo una cuenta"
      backButtonHref="/auth/login"
    >
      <SignupForm />
    </CardWrapper>
  )
}
