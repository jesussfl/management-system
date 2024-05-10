import { Metadata } from 'next'
import { CredentialsSignupForm } from '@/app/(auth)/components/credentials-signup-form'
import { CardWrapper } from '@/app/(auth)/components/card-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { FaceSignupForm } from '@/app/(auth)/components/face-signup-form'
export const metadata: Metadata = {
  title: 'Registro',
  description: ' Ingresa tus datos para crear tu cuenta',
}

export default function Page({
  searchParams,
}: {
  searchParams: { error: string | null }
}) {
  const cardLabel =
    searchParams.error === 'unrecognizedFace'
      ? 'Parece que no estás registrado en nuestra base de datos. Ingresa la información para crear tu cuenta'
      : 'Ingresa la información para crear tu ID Facial o registrate mediante correo y contraseña'
  return (
    <CardWrapper
      error={searchParams.error === 'unrecognizedFace'}
      headerTitle="Registro"
      headerLabel={cardLabel}
      backButtonLabel="Ya tengo una cuenta"
      backButtonHref="/auth/login"
    >
      <Tabs
        className="flex flex-col gap-2"
        defaultValue="Reconocimiento Facial"
      >
        <TabsList className="mx-5">
          <TabsTrigger value="Reconocimiento Facial">ID Facial</TabsTrigger>
          <TabsTrigger value="Correo y Contraseña">Registro Básico</TabsTrigger>
        </TabsList>
        <TabsContent value="Reconocimiento Facial">
          <FaceSignupForm />
        </TabsContent>
        <TabsContent value="Correo y Contraseña">
          <CredentialsSignupForm />
        </TabsContent>
      </Tabs>
    </CardWrapper>
  )
}
