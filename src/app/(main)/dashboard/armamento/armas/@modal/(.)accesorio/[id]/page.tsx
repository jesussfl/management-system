import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getGunCaliberById } from '../../../lib/actions/calibre'
import GunCalibersForm from '../../../components/forms/gun-calibers-form'
import { getAccessoryById } from '../../../lib/actions/accesories'
import GunAccessoriesForm from '../../../components/forms/gun-accessories-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunAccesory = await getAccessoryById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Accesorio de Arma
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunAccessoriesForm defaultValues={gunAccesory} />
      </DialogContent>
    </Dialog>
  )
}
