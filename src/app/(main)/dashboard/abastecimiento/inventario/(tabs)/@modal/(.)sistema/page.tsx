import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import SubsystemForm from '../../../../../components/forms/subsystem-form'
import SystemForm from '../../../../../components/forms/system-form'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'h-[90vh] overflow-hidden p-0 lg:max-w-screen-lg'}
      >
        <DialogHeader className="mb-8 border-b border-border p-5">
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
