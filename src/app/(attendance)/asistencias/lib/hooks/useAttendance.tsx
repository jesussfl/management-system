import { getLastAttendanceByUserId } from '@/app/(main)/dashboard/recursos-humanos/asistencias/lib/actions'

import { getAttendanceTime } from '../helpers/get-attendance-time'
export default async function useAttendance(userId: string) {
  const lastAttendance = await getLastAttendanceByUserId(userId)

  const inTime = lastAttendance?.hora_entrada
    ? getAttendanceTime(lastAttendance?.hora_entrada)
    : 'Sin registrar'

  const outTime = lastAttendance?.hora_salida
    ? getAttendanceTime(lastAttendance?.hora_salida)
    : 'Sin registrar'

  return {
    inTime,
    outTime,
  }
}
