import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ItemsForm from '../../../../../components/item-form'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent customClose className={'lg:max-w-screen-lg p-0'}>
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Crear Renglón
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ItemsForm section="Abastecimiento" />
      </DialogContent>
    </Dialog>
  )
}