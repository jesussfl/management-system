import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { getZodiById } from '../../../../lib/actions/zodis'
import ZodisForm from '../../../../components/forms/zodi-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const zodiData = await getZodiById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden max-h-[90vh] p-0'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Zodi
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ZodisForm defaultValues={zodiData} />
      </DialogContent>
    </Dialog>
  )
}
