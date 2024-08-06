import PageForm from '@/modules/layout/components/page-form'
import { getAllSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { inventorySerialColumns } from '@/app/(main)/dashboard/components/columns/serial-columns/inventory-serial-columns'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const serialsData = await getAllSerialsByItemId(Number(id))
  return (
    <PageForm title="Ver seriales" backLink="/dashboard/armamento/inventario">
      <DataTable
        columns={inventorySerialColumns}
        data={serialsData}
        isStatusEnabled={false}
      />
    </PageForm>
  )
}
