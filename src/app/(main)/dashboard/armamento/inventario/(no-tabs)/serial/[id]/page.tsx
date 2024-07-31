import PageForm from '@/modules/layout/components/page-form'
import { getAllSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from '@/app/(main)/dashboard/armamento/inventario/components/columns/serial-columns'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const serialsData = await getAllSerialsByItemId(Number(id))
  return (
    <PageForm title="Ver seriales" backLink="/dashboard/armamento/inventario">
      <DataTable columns={columns} data={serialsData} isStatusEnabled={false} />
    </PageForm>
  )
}
