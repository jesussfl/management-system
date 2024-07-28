import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import SubsystemForm from '../../../../../components/subsystem-form'
import SystemForm from '../../../../../components/system-form'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0 h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Crear Sistema
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <SystemForm />
      </DialogContent>
    </Dialog>
  )
}
