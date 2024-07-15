import PinForm from '@/app/(auth)/components/pin-form'
import { getUserByFacialID } from '@/lib/data/get-user-byEmail'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { redirect } from 'next/navigation'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const userData = await getUserByFacialID(id)

  if (!userData || !userData?.facialID) {
    redirect('/auth')
  }

  return (
    <Dialog open={true}>
      <DialogContent customClose className={'w-[300px] overflow-hidden'}>
        <DialogHeader className="p-5 mb-8">
          <DialogTitle className="text-sm font-semibold text-foreground">
            PIN
          </DialogTitle>
        </DialogHeader>
        <CloseButtonDialog />
        <PinForm facialId={userData?.facialID} />
      </DialogContent>
    </Dialog>
  )
}
