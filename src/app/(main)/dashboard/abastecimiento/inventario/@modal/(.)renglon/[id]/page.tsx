import { getItemById } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ItemsForm from '../../../components/forms/items-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const itemData = await getItemById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden max-h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar renglón
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ItemsForm defaultValues={itemData} />
      </DialogContent>
    </Dialog>
  )
}
