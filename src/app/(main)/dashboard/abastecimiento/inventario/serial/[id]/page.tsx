import PageForm from '@/modules/layout/components/page-form'
import { getAllSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/serial-columns'
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
      <DataTable columns={columns} data={serialsData} />
    </PageForm>
  )
}
