import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getGunCaliberById } from '../../../lib/actions/calibre'
import GunCalibersForm from '../../../components/forms/gun-calibers-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunCaliber = await getGunCaliberById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Calibre de Arma
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunCalibersForm defaultValues={gunCaliber} />
      </DialogContent>
    </Dialog>
  )
}
