import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, IterationCcw, PackagePlus } from 'lucide-react'
import Link from 'next/link'

import { getAllProfessionalsToCombobox } from '../../../profesionales/lib/actions/professionals'
import { getAllReceiversToCombobox } from '../../../armamento/destinatarios/lib/actions/receivers'
import { getReturnById } from '../../../../../../lib/actions/return'
import ReturnsForm from '../../../components/forms/return-form/returns-form'
import { getAllItems } from '../../../../../../lib/actions/item'

export const metadata: Metadata = {
  title: 'Devoluciones',
  description: 'Desde aquí puedes administrar las devoluciones del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems(true, 'Armamento')
  const devolution = await getReturnById(Number(params.id))
  const receiver = await getAllReceiversToCombobox('Armamento')
  const professionals = await getAllProfessionalsToCombobox(true)
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/armamento/devoluciones"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <IterationCcw size={24} />
              Editar Devolución
            </PageHeaderTitle>
            <PageHeaderDescription>
              Las devoluciones serán agregadas al inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReturnsForm
          servicio="Armamento"
          renglonesData={itemsData}
          defaultValues={devolution}
          receivers={receiver}
          professionals={professionals}
          id={devolution.id}
        />
      </PageContent>
    </>
  )
}
