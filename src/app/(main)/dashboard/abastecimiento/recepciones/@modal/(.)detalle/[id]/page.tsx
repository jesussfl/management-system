import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getReceptionById } from '@/lib/actions/reception'
import { ReceivedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getReceptionById(Number(id))
  const renglones = reception.renglones
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className="overflow-y-auto max-h-[90vh] w-[80vw] md:w-[60vw] lg:w-[60vw]"
      >
        <DialogHeader className="py-3 mb-8">
          <DialogTitle className="font-semibold text-foreground">
            Detalles de la Recepción
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renglones.map((renglon, index) => (
            <ReceivedItemDetails key={renglon.id} data={renglon} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
