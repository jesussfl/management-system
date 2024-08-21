import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getLoanForExportGuide } from '@/lib/actions/loan'
import FormatSelector from '@/modules/common/components/format-selector'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getLoanForExportGuide(Number(id))

  return (
    <Dialog open={true}>
      <DialogContent customClose className={'max-w-[300px] overflow-hidden'}>
        <DialogHeader className="mb-8 pb-5">
          <DialogTitle>Exportar</DialogTitle>
        </DialogHeader>
        <FormatSelector data={guideData} type="prestamo" />
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
