import SubsystemForm from '@/app/(main)/dashboard/components/subsystem-form'
import { getSubsystemById } from '@/app/(main)/dashboard/lib/actions/subsystems'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

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
