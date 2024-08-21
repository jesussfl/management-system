import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

import { getLoanById } from '@/lib/actions/loan'
import { DispatchedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const loan = await getLoanById(Number(id))
  const loanDetails = loan.renglones
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={
          'max-h-[90vh] w-[80vw] overflow-y-auto md:w-[60vw] lg:w-[60vw]'
        }
      >
        <DialogHeader className="mb-8 border-b border-border p-5">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Detalles del prestamo
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {loanDetails.map((detail, index) => (
            <DispatchedItemDetails key={index} data={detail} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
