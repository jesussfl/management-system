import { CredentialsSignupForm } from '@/app/(auth)/components/credentials-signup-form'
import { FaceSignupForm } from '@/app/(auth)/components/face-signup-form'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/basic-tabs'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm title="Agregar usuario" backLink="/dashboard/usuarios">
      <div className="flex flex-col gap-4 justify-center items-center mb-32">
        <Tabs
          className="flex w-[500px] flex-col gap-2"
          defaultValue="Reconocimiento Facial"
        >
          <TabsList className="mx-5">
            <TabsTrigger value="Reconocimiento Facial">
              Mediante ID Facial
            </TabsTrigger>
            <TabsTrigger value="Correo y Contraseña">
              Mediante Correo y Contraseña
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Reconocimiento Facial">
            <FaceSignupForm />
          </TabsContent>
          <TabsContent value="Correo y Contraseña">
            <CredentialsSignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </PageForm>
  )
}
