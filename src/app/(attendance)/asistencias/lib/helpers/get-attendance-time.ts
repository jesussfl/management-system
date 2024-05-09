import { format, isToday } from 'date-fns'

export const getAttendanceTime = (attendanceDateTime: Date) => {
  if (isToday(attendanceDateTime))
    return format(attendanceDateTime, 'dd/MM/yyyy HH:mm')

  return 'Sin registrar hoy'
}
