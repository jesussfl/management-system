import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getGunPartById } from '../../../lib/actions/parts'
import GunPartsForm from '../../../components/forms/gun-parts-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunPart = await getGunPartById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Parte de Arma
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunPartsForm defaultValues={gunPart} />
      </DialogContent>
    </Dialog>
  )
}
