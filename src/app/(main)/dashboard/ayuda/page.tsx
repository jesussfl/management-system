import { BookOpen, HeartHandshakeIcon, Mail, Phone } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import ButtonExport from './button-export'

export const metadata: Metadata = {
  title: 'Ayuda',
  description: 'Desde aquí puedes resolver dudas',
}
export default async function Page() {
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <HeartHandshakeIcon size={24} />
            Centro de Ayuda
          </PageHeaderTitle>
        </HeaderLeftSide>
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>

      <PageContent>
        <Card className="w-[500px] space-y-4">
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>
              Si tienes alguna duda o consulta puedes contactarnos a traves de
              los siguientes medios:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant={'default'} className="mb-6">
              <Mail className="h-4 w-4" />
              <AlertTitle>Correo: </AlertTitle>
              <AlertDescription>Jesussflr@gmail.com</AlertDescription>
            </Alert>

            <Alert variant={'default'} className="mb-6">
              <Phone className="h-4 w-4" />
              <AlertTitle>Teléfono: </AlertTitle>
              <AlertDescription>+58 412-899-4743</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Card className="w-[500px]">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-green-600" />
            <CardTitle>¿Necesitas ayuda?</CardTitle>
            <CardDescription>
              Desde aqui puedes descargar el manual de usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonExport />
          </CardContent>
        </Card>
      </PageContent>
    </>
  )
}
