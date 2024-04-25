import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import UsersForm from '../../components/users-form'
import { getUserById } from '../../lib/actions/users'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const userData = await getUserById(id)
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Usuario
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <UsersForm defaultValues={userData} />
      </DialogContent>
    </Dialog>
  )
}
