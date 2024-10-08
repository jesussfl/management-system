import { Metadata } from 'next'
import DispatchesForm from '@/app/(main)/dashboard/components/forms/dispatch-form/dispatches-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/lib/actions/item'
import { PackageMinus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import { getAllReceiversToCombobox } from '../../destinatarios/lib/actions/receivers'
import { getAllProfessionalsToCombobox } from '../../../profesionales/lib/actions/professionals'

export const metadata: Metadata = {
  title: 'Despachos',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}

export default async function Page() {
  const itemsData = await getAllItems(true, 'Abastecimiento')
  const receivers = await getAllReceiversToCombobox('Abastecimiento')
  const professionals = await getAllProfessionalsToCombobox(true)
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackageMinus size={24} />
              Crea un despacho
            </PageHeaderTitle>
            <PageHeaderDescription>
              Los despachos serán descontados del inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <DispatchesForm
          servicio="Abastecimiento"
          renglonesData={itemsData}
          receivers={receivers}
          professionals={professionals}
        />
      </PageContent>
    </>
  )
}
