import { Metadata } from 'next'
import DispatchesForm from '@/modules/despachos/components/form/dispatches-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/lib/actions/items'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import ReceptionsForm from '@/modules/recepciones/components/form/receptions-form'
import { getReceptionById } from '@/lib/actions/receptions'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar las entradas del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems()
  const reception = await getReceptionById(Number(params.id))
  console.log(reception, 'reception')
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/recepciones"
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
        <ReceptionsForm renglonesData={itemsData} defaultValues={reception} />
      </PageContent>
    </>
  )
}
