import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getSubsystemById } from '../../../../../lib/actions/subsystems'
import SubsystemForm from '../../../../../components/subsystem-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const subsystemData = await getSubsystemById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Subsistema
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <SubsystemForm defaultValues={subsystemData} />
      </DialogContent>
    </Dialog>
  )
}
