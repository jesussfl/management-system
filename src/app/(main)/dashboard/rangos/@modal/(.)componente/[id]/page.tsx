import { getComponentById } from '@/app/(main)/dashboard/rangos/lib/actions/ranks'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ComponentsForm from '@/app/(main)/dashboard/rangos/components/forms/components-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const componentData = await getComponentById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Componente
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <ComponentsForm defaultValues={componentData} />
      </DialogContent>
    </Dialog>
  )
}
