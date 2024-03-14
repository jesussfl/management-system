import { getPackagingUnitById } from '@/lib/actions/packaging-units'
import PackagingUnitsForm from '@/modules/inventario/components/packaging-units-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const packagingUnit = await getPackagingUnitById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Unidad de Empaque</PageHeaderTitle>
      </PageHeader>
      <PackagingUnitsForm defaultValues={packagingUnit} />
    </>
  )
}
