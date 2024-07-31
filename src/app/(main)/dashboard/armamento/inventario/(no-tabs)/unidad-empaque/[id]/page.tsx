import { getPackagingUnitById } from '@/app/(main)/dashboard/lib/actions/packaging-units'
import PackagingUnitsForm from '@/app/(main)/dashboard/components/packaging-units-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const packagingUnit = await getPackagingUnitById(Number(id))
  return (
    <PageForm
      title="Editar Unidad de Empaque"
      backLink="/dashboard/armamento/inventario"
    >
      <PackagingUnitsForm defaultValues={packagingUnit} />
    </PageForm>
  )
}
