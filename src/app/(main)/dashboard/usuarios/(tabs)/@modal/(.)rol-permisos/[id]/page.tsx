import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ViewPermissionsForm from '../../../../components/roles-form/view-permissions-form'
import { getRolById } from '../../../../lib/actions/roles'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const role = await getRolById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg  overflow-hidden max-h-[80vh]'}
      >
        <DialogHeader className="px-5 pb-2">
          <DialogTitle className="text-md font-semibold text-foreground">
            Ver Permisos del Rol: {role.rol}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {`Cantidad de permisos activos: ${role.permisos.length}`}
          </DialogDescription>
        </DialogHeader>
        <CloseButtonDialog />
        <ViewPermissionsForm defaultValues={role} />
      </DialogContent>
    </Dialog>
  )
}
