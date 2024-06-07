import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import GunModelsForm from '../../../components/forms/gun-models-form'
import { getGunModelById } from '../../../lib/actions/model-actions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunModel = await getGunModelById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Modelo de Arma
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunModelsForm defaultValues={gunModel} />
      </DialogContent>
    </Dialog>
  )
}
