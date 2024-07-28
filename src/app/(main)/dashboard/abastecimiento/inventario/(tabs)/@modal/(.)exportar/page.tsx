import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ExportExcelButton from '../../../components/items-export-button'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent customClose className={'lg:max-w-screen-lg max-h-[90vh]'}>
        <DialogHeader className="border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Exportar
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        {/* <ExportExcelButton /> */}
        {/* <ClassificationsForm /> */}
      </DialogContent>
    </Dialog>
  )
}
