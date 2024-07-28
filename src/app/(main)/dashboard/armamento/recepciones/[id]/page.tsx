import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/armamento/inventario/lib/actions/items'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import { getAllReceiversToCombobox } from '../../destinatarios/lib/actions/receivers'
import { getAllProfessionalsToCombobox } from '../../../profesionales/lib/actions/professionals'
import ReceptionsForm from '../../../components/reception-form/receptions-form'
import { getReceptionById } from '../../../lib/actions/reception'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar las entradas del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems()
  const reception = await getReceptionById(Number(params.id))
  const receivers = await getAllReceiversToCombobox('Armamento')
  const professionals = await getAllProfessionalsToCombobox()

  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/armamento/recepciones"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Recepción
            </PageHeaderTitle>
            <PageHeaderDescription>
              Las recepciones serán agregadas al inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReceptionsForm
          servicio="Armamento"
          renglonesData={itemsData}
          defaultValues={reception}
          receivers={receivers}
          professionals={professionals}
          id={reception?.id}
        />
      </PageContent>
    </>
  )
}
