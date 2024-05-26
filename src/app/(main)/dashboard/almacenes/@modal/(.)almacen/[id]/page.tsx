import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getWarehouseById } from '../../../lib/actions/warehouse'
import WarehousesForm from '../../../components/form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const warehouseData = await getWarehouseById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Almacén
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <WarehousesForm defaultValues={warehouseData} />
      </DialogContent>
    </Dialog>
  )
}
