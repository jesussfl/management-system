import { Metadata } from 'next'
import { CredentialsSignupForm } from '@/modules/auth/templates/credentials-signup-form'
import { CardWrapper } from '@/modules/auth/components/card-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import { FaceSignupForm } from '@/modules/auth/templates/face-signup-form'
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
      <Tabs
        className="flex flex-col gap-2"
        defaultValue="Reconocimiento Facial"
      >
        <TabsList className="mx-5">
          <TabsTrigger value="Reconocimiento Facial">
            Reconocimiento Facial
          </TabsTrigger>
          <TabsTrigger value="Correo y Contraseña">
            Correo y Contraseña
          </TabsTrigger>
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
