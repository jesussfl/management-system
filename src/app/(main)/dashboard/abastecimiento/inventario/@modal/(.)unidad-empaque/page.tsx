import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import PackagingUnitsForm from '@/modules/inventario/components/packaging-units-form'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0 max-h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Crear Unidad de Empaque
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <PackagingUnitsForm />
      </DialogContent>
    </Dialog>
  )
}
