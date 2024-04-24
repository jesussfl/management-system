import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getRolById } from '../../../lib/actions/roles'
import RolesForm from '../../../components/roles-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const rolData = await getRolById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Rol
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <RolesForm defaultValues={rolData} />
      </DialogContent>
    </Dialog>
  )
}
