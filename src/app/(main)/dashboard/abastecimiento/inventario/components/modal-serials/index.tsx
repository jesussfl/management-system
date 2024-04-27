import { DataTable } from '@/modules/common/components/table/data-table'
import { columns as serialColumns } from '../serial-columns'
import { getSerialsByItemId } from '@/lib/actions/serials'
export default async function ModalContentSerials({ id }: { id: number }) {
  const seriales = await getSerialsByItemId(id)
  return (
    <div className="p-8">
      <div className="mb-3">Seriales</div>
      <DataTable columns={serialColumns} data={seriales} />
    </div>
  )
}
