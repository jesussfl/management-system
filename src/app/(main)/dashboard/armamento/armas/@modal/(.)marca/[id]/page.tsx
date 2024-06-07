import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getGunBrandById } from '../../../lib/actions/brand'
import GunBrandsForm from '../../../components/forms/gun-brands-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gunBrand = await getGunBrandById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Marca de Arma
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GunBrandsForm defaultValues={gunBrand} />
      </DialogContent>
    </Dialog>
  )
}
