import { getPackagingUnitById } from '@/lib/actions/packaging-units'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ClassificationsForm from '@/modules/inventario/components/classification-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const packagingUnitData = await getPackagingUnitById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Unidad de Empaque
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ClassificationsForm defaultValues={packagingUnitData} />
      </DialogContent>
    </Dialog>
  )
}
