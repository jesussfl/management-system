import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getUnitById } from '../../../lib/actions/units'
import UnitsForm from '../../../components/forms/unit-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const unitData = await getUnitById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden max-h-[90vh] p-0'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Unidad
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <UnitsForm defaultValues={unitData} />
      </DialogContent>
    </Dialog>
  )
}
