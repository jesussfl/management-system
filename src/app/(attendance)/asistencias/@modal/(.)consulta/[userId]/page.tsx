import { getLastAttendanceByUserId } from '@/app/(main)/dashboard/recursos-humanos/asistencias/lib/actions'
import { getUserById } from '@/app/(main)/dashboard/usuarios/lib/actions/users'
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
import { format } from 'date-fns'
import { Rocket } from 'lucide-react'

export default async function Page({
  params: { userId },
}: {
  params: { userId: string }
}) {
  const user = await getUserById(userId)
  const lastAttendance = await getLastAttendanceByUserId(userId)

  const inTime = lastAttendance?.hora_entrada
    ? format(new Date(lastAttendance.hora_entrada), 'dd/MM/yyyy HH:mm')
    : 'Sin registrar hoy'

  const outTime = lastAttendance?.hora_salida
    ? format(new Date(lastAttendance.hora_salida), 'dd/MM/yyyy HH:mm')
    : 'Sin registrar hoy'
  if (!user) return <div>No existe el usuario</div>

  if (!user.personal)
    return (
      <div>El usuario no tiene Información registrada en el sistema aún</div>
    )

  const data = [
    {
      title: 'Nombre Completo',
      info: `${user.personal.nombres} ${user.personal.apellidos}`,
    },
    {
      title: 'Cédula',
      info: `${user.personal.tipo_cedula}-${user.personal.cedula}`,
    },
    {
      title: 'Próxima Guardia',
      info: `PROXIMAMENTE...`,
    },
    {
      title: 'Ubicación de la Guardia',
      info: `PROXIMAMENTE...`,
    },
  ]
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
              {data.map(({ title, info }) => (
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
