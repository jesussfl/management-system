import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import FormatSelector from '@/modules/common/components/format-selector'
import { getReturnForExportGuide } from '@/lib/actions/return'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getReturnForExportGuide(Number(id))

  return (
    <Dialog open={true}>
      <DialogContent customClose className={'max-w-[300px] overflow-hidden'}>
        <DialogHeader className="mb-8 pb-5">
          <DialogTitle>Exportar</DialogTitle>
        </DialogHeader>
        <FormatSelector data={guideData} type="devolucion" />
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
