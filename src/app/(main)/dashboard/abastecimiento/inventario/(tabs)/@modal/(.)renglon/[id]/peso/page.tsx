import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getTotalWeightByItemId } from '@/lib/actions/serials'
import { getItemById } from '@/lib/actions/item'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const totalWeight = await getTotalWeightByItemId(Number(id))
  const itemData = await getItemById(Number(id))

  const message =
    itemData.stock_actual === 0
      ? 'Sin stock'
      : `El peso total es: ${totalWeight} ${itemData.unidad_empaque?.tipo_medida || itemData.tipo_medida_unidad || ''}`
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'max-h-[90vh] w-[350px] overflow-y-auto'}
      >
        <DialogHeader className="mb-8 border-b border-border p-5">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Peso total
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <p>{message}</p>
      </DialogContent>
    </Dialog>
  )
}
