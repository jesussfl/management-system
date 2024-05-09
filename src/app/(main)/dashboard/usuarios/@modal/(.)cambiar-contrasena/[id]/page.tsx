import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ChangeUserPasswordForm from '../../../components/users-form/change-password-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Cambiar Contraseña
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ChangeUserPasswordForm id={id} />
      </DialogContent>
    </Dialog>
  )
}
