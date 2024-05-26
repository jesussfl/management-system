import { Metadata } from 'next'
import ReceptionsForm from '@/app/(main)/dashboard/armamento/recepciones/components/form/receptions-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/armamento/inventario/lib/actions/items'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems()

  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Crea una recepción
            </PageHeaderTitle>
            <PageHeaderDescription>
              Las recepciones serán agregadas al inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReceptionsForm renglonesData={itemsData} />
      </PageContent>
    </>
  )
}
