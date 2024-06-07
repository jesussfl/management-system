import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import GunTypesForm from '../../../components/forms/gun-types-form'
import { getGunTypeById } from '../../../lib/actions/type'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunType = await getGunTypeById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Tipo de Armamento
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunTypesForm defaultValues={gunType} />
      </DialogContent>
    </Dialog>
  )
}
