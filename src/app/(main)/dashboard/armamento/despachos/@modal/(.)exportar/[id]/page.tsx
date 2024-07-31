import { getDispatchForExportGuide } from '@/lib/actions/dispatch'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import FormatSelector from '@/modules/common/components/format-selector'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const guideData = await getDispatchForExportGuide(Number(id))

  return (
    <Dialog open={true}>
      <DialogContent customClose className={'overflow-hidden max-w-[300px]'}>
        <DialogHeader className="pb-5 mb-8 ">
          <DialogTitle>Exportar</DialogTitle>
        </DialogHeader>
        <FormatSelector data={guideData} type="despacho" />
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}
