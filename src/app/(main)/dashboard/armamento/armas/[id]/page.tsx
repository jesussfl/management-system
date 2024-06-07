import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, Bomb } from 'lucide-react'
import Link from 'next/link'
import { getAllWarehousesToCombobox } from '../../../almacenes/lib/actions/warehouse'
import { getAllUnitsToCombobox } from '../../../unidades/lib/actions/units'
import { getAllGunModelsToCombobox } from '../lib/actions/model-actions'
import GunsForm from '../components/form/guns-form'
import { getGunById } from '../lib/actions/guns'
export const metadata: Metadata = {
  title: 'Editar Armamento',
  description: 'Desde aquí puedes editar el armamento',
}

export default async function Page({ params }: { params: { id: string } }) {
  const warehouses = await getAllWarehousesToCombobox()
  const units = await getAllUnitsToCombobox()
  const models = await getAllGunModelsToCombobox()
  const gun = await getGunById(Number(params.id))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/armamento/armas"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <PageHeaderTitle>
            <Bomb size={24} />
            Editar Armamento
          </PageHeaderTitle>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <GunsForm
          warehouses={warehouses}
          units={units}
          models={models}
          defaultValues={gun}
        />
      </PageContent>
    </>
  )
}
