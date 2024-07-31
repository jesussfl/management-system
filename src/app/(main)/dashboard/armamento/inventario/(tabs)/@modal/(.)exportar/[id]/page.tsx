import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle>Exportar</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-5"></div>
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
