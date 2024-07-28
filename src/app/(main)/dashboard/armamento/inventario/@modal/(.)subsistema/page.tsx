import SubsystemForm from '@/app/(main)/dashboard/components/subsystem-form'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0 h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Crear Subsistema
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <SubsystemForm />
      </DialogContent>
    </Dialog>
  )
}
