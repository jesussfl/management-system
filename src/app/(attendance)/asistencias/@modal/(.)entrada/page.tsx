import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import ValidationForm from '../../components/verification-form'

export default async function Page() {
  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle>Verifica tu entrada</DialogTitle>
        </DialogHeader>
        <ValidationForm type="entrada" />

        <CloseButtonDialog route="/asistencias" />
      </DialogContent>
    </Dialog>
  )
}
