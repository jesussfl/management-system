import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { Bomb } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import GunsForm from '../components/form/guns-form'
import { getAllWarehousesToCombobox } from '../../../almacenes/lib/actions/warehouse'
import { getAllUnitsToCombobox } from '../../../unidades/lib/actions/units'
import { getAllGunModelsToCombobox } from '../lib/actions/model-actions'

export const metadata: Metadata = {
  title: 'Agregar arma',
  description: 'Desde aquí puedes agregar un arma',
}

export default async function Page() {
  const warehouses = await getAllWarehousesToCombobox()
  const units = await getAllUnitsToCombobox()
  const models = await getAllGunModelsToCombobox()

  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />
          <PageHeaderTitle>
            <Bomb size={24} />
            Agrega un arma
          </PageHeaderTitle>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <GunsForm warehouses={warehouses} units={units} models={models} />
      </PageContent>
    </>
  )
}
