import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import OrderStatusForm from './form'
import { getOrderById } from '@/app/(main)/dashboard/lib/actions/order'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const order = await getOrderById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden w-[300px]'}
      >
        <DialogHeader className="p-2 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Estado del Pedido
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <OrderStatusForm orderId={Number(id)} estado={order.estado} />
        {/* <UsersForm defaultValues={userData} /> */}
      </DialogContent>
    </Dialog>
  )
}
