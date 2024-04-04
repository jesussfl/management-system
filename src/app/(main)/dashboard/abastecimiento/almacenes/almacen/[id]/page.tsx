import PageForm from '@/modules/layout/components/page-form'
import { getWarehouseById } from '../../lib/actions/warehouse'
import WarehousesForm from '../../components/form/'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const warehouseData = await getWarehouseById(Number(id))
  return (
    <PageForm
      title="Editar Almacén"
      backLink="/dashboard/abastecimiento/almacenes"
    >
      <WarehousesForm defaultValues={warehouseData} />
    </PageForm>
  )
}
