import { getGradeById } from '@/app/(main)/dashboard/rangos/lib/actions/ranks'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import GradesForm from '@/app/(main)/dashboard/rangos/components/forms/grades-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gradeData = await getGradeById(Number(id))
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden p-0 h-[90vh]'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground">
            Editar Grado
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <GradesForm defaultValues={gradeData} />
      </DialogContent>
    </Dialog>
  )
}
