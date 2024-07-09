import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, UserPlus2 } from 'lucide-react'
import Link from 'next/link'
import ReceiversForm from './form'

export const metadata: Metadata = {
  title: 'Destinatarios',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/destinatarios"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <UserPlus2 size={24} />
              Agrega un destinatario
            </PageHeaderTitle>
            <PageHeaderDescription>
              Registra las personas que reciben los despachos
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReceiversForm />
      </PageContent>
    </>
  )
}
