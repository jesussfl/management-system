import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import SystemForm from '../../../../../../components/system-form'
import { getSystemById } from '../../../../../../lib/actions/systems'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const systemData = await getSystemById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Sistema
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <SystemForm defaultValues={systemData} />
      </DialogContent>
    </Dialog>
  )
}
