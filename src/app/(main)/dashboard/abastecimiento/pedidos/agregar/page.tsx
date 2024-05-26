import { Metadata } from 'next'
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
import { getAllReceivers } from '../../destinatarios/lib/actions/receivers'
import { getAllProfessionals } from '../../../profesionales/lib/actions/professionals'
import OrdersForm from '../components/forms/orders-form'
import { getAllUnits } from '../../../unidades/lib/actions/units'
import { getAllSuppliers } from '../lib/actions/suppliers'

export const metadata: Metadata = {
  title: 'Agregar Pedido',
  description: 'Desde aquí puedes agregar un nuevo pedido',
}

export default async function Page() {
  const itemsData = await getAllItems()
  const receivers = await getAllReceivers()
  const suppliers = await getAllSuppliers()

  const comboBoxSuppliers = suppliers.map((supplier) => {
    return {
      value: supplier.id,
      label: supplier.nombre,
    }
  })

  const comboBoxReceivers = receivers.map((receiver) => {
    return {
      value: receiver.id,
      label: `${receiver.tipo_cedula}-${receiver.cedula} ${receiver.nombres}`,
    }
  })

  const professionals = await getAllProfessionals()

  const comboBoxProfessionals = professionals.map((professional) => {
    return {
      value: professional.id,
      label: `${professional.tipo_cedula}-${professional.cedula} ${professional.nombres}`,
    }
  })
  const units = await getAllUnits()

  const comboBoxUnits = units.map((unit) => {
    return {
      value: unit.id,
      label: unit.nombre,
    }
  })

  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Crea un nuevo pedido
            </PageHeaderTitle>
            <PageHeaderDescription>
              Lleva un control de los suministros que solicitas en el CESERLODAI
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <OrdersForm
          suppliers={comboBoxSuppliers}
          items={itemsData}
          units={comboBoxUnits}
          receivers={comboBoxReceivers}
          professionals={comboBoxProfessionals}
        />
      </PageContent>
    </>
  )
}
