import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import LoanStatusForm from './form'
import { getLoanById } from '@/lib/actions/loan'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const order = await getLoanById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'w-[300px] overflow-hidden lg:max-w-screen-lg'}
      >
        <DialogHeader className="mb-8 border-b border-border p-2">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Estado del Préstamo
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <LoanStatusForm orderId={Number(id)} estado={order.estado} />
        {/* <UsersForm defaultValues={userData} /> */}
      </DialogContent>
    </Dialog>
  )
}
