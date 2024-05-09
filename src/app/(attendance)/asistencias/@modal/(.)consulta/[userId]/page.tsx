import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import CloseButtonDialog from '@/modules/common/components/dialog-close'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/modules/common/components/dialog/dialog'
import { Rocket } from 'lucide-react'
import useAttendance from '../../../lib/hooks/useAttendance'
import useUserData from '../../../lib/hooks/useUserData'

export default async function Page({
  params: { userId },
}: {
  params: { userId: string }
}) {
  const { dataToShow } = await useUserData(userId)
  const { inTime, outTime } = await useAttendance(userId)

  if (!dataToShow)
    return (
      <div>El usuario no tiene Información registrada en el sistema aún</div>
    )

  return (
    <Dialog open={true}>
      <DialogContent
        customClose
        className={'lg:max-w-screen-lg overflow-hidden'}
      >
        <DialogHeader className="p-5 mb-8 border-b border-border">
          <DialogTitle>Consulta de Información</DialogTitle>
        </DialogHeader>

        <div>
          <Alert variant={'success'}>
            <Rocket className="h-4 w-4" />
            <AlertTitle>Hora de Entrada: </AlertTitle>
            <AlertDescription>{inTime}</AlertDescription>
          </Alert>
          <Alert variant={'destructive'}>
            <Rocket className="h-4 w-4" />
            <AlertTitle>Hora de Salida: </AlertTitle>
            <AlertDescription>{outTime}</AlertDescription>
          </Alert>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              {dataToShow.map(({ title, info }) => (
                <UserDetail key={title} title={title} info={info} />
              ))}
            </dl>
          </div>
        </div>
        <CloseButtonDialog />
      </DialogContent>
    </Dialog>
  )
}

function UserDetail({ title, info }: { title: string; info: string | number }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">{title}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {info}
      </dd>
    </div>
  )
}
