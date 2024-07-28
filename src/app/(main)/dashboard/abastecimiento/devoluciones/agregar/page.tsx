import { Metadata } from 'next'
import ReceptionsForm from '@/app/(main)/dashboard/components/reception-form/receptions-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import ReturnsForm from '../../../components/return-form/returns-form'
import { getAllReceiversToCombobox } from '../../destinatarios/lib/actions/receivers'
import { getAllProfessionalsToCombobox } from '../../../profesionales/lib/actions/professionals'

export const metadata: Metadata = {
  title: 'Devoluciones',
  description: 'Desde aquí puedes administrar las devoluciones del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems(true)
  const receivers = await getAllReceiversToCombobox('Abastecimiento')
  const professionals = await getAllProfessionalsToCombobox(true)
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Agrega una devolución
            </PageHeaderTitle>
            <PageHeaderDescription>
              Las devoluciones serán agregadas al inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReturnsForm
          servicio="Abastecimiento"
          renglonesData={itemsData}
          receivers={receivers}
          professionals={professionals}
        />
      </PageContent>
    </>
  )
}
