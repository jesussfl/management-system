import { Metadata } from 'next'
import DispatchesForm from '@/app/(main)/dashboard/components/dispatch-form/dispatches-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import { getReceiverById } from '../lib/actions/receivers'
import ReceiversForm from '../agregar/form'

export const metadata: Metadata = {
  title: 'Destinatarios',
  description: 'Los Destinatarios son las personas que reciben los despachos',
}

export default async function Page({ params }: { params: { id: string } }) {
  const receiver = await getReceiverById(Number(params.id))
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
              <PackagePlus size={24} />
              Editar destinatario
            </PageHeaderTitle>
            <PageHeaderDescription>
              Los Destinatarios son las personas que reciben los despachos
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReceiversForm defaultValues={receiver} />
      </PageContent>
    </>
  )
}
