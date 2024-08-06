import PageForm from '@/modules/layout/components/page-form'
import { DataTable } from '@/modules/common/components/table/data-table'
import { getAllSerialsByItemId } from '@/lib/actions/serials'
import { inventorySerialColumns } from '@/app/(main)/dashboard/components/columns/serial-columns/inventory-serial-columns'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const serialsData = await getAllSerialsByItemId(Number(id))
  return (
    <PageForm
      title="Ver seriales"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <DataTable
        columns={inventorySerialColumns}
        data={serialsData}
        isStatusEnabled={false}
      />
    </PageForm>
  )
}
