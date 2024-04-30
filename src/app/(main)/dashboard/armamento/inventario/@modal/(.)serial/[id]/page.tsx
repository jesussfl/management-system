import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getAllSerialsByItemId } from '@/lib/actions/serials'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from '../../../components/serial-columns'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const serialsData = await getAllSerialsByItemId(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-y-auto max-h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Seriales
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <DataTable columns={columns} data={serialsData} />
      </DialogContent>
    </Dialog>
  )
}
