import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import FormatSelector from '@/modules/common/components/format-selector'
import { getReceptionForExportGuide } from '../../../lib/actions/receptions'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getReceptionForExportGuide(Number(id))

  return (
    <Dialog open={true}>
      <DialogContent customClose className={'overflow-hidden max-w-[300px]'}>
        <DialogHeader className="pb-5 mb-8 ">
          <DialogTitle>Exportar</DialogTitle>
        </DialogHeader>
        <FormatSelector data={guideData} type="recepcion" />
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
