import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getPermissionById } from '../../../lib/actions/permissions'
import PermissionsForm from '../../../components/permissions-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const permissionData = await getPermissionById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Permiso
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <PermissionsForm defaultValues={permissionData} />
      </DialogContent>
    </Dialog>
  )
}
