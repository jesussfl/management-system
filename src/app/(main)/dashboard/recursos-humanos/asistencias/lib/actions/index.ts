'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

import { Prisma } from '@prisma/client'

import { registerAuditAction } from '@/lib/actions/audit'
import { format, getDaysInMonth } from 'date-fns'
import { es } from 'date-fns/locale'

export const createAttendance = async (
  data: Prisma.AsistenciaUncheckedCreateInput
) => {
  await prisma.asistencia.create({
    data,
  })

  await registerAuditAction(
    'Se registro una nueva asistencia de el usuario con el id' + data.id_usuario
  )
  revalidatePath('/dashboard/recursos-humanos/asistencias')

  return {
    success: 'La asistencia ha sido creado con exito',
    error: false,
  }
}
export const updateAttendance = async (
  id: number,
  data: Prisma.AsistenciaUpdateInput
) => {
  await prisma.asistencia.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizo la asistencia con el id ' + id)

  revalidatePath('/dashboard/recursos-humanos/asistencias')

  return {
    success: 'La asistencia ha sido actualizada con exito',
    error: false,
  }
}
export const getAllAttendances = async () => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  const auditItems = await prisma.asistencia.findMany({
    include: {
      usuario: {
        include: {
          personal: {
            include: {
              categoria: true,
              componente: true,
              grado: true,
              unidad: true,
            },
          },
        },
      },
    },
  })

  return auditItems
}

export const getLastAttendanceByUserId = async (userId: string) => {
  const attendance = await prisma.asistencia.findFirst({
    where: {
      id_usuario: userId,
    },
    orderBy: {
      fecha_realizado: 'desc',
    },
  })

  if (!attendance) {
    return null
  }

  return attendance
}
export const getAttendancesByUserId = async (userId: string) => {
  const session = await auth()

  if (!session?.user) {
    revalidatePath('/')
  }

  const attendances = await prisma.asistencia.findMany({
    where: {
      id_usuario: userId,
    },
  })

  return attendances
}

export const getAllUsersWithAttendances = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const users = await prisma.usuario.findMany({
    include: {
      asistencias: true,
      personal: true,
    },
  })
  return users
}

export const getUserWithAttendances = async (userId: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const user = await prisma.usuario.findUnique({
    where: {
      id: userId,
    },
    include: {
      asistencias: true,
      personal: true,
    },
  })
  return user
}

export const generateAttendanceReport = async (date: Date) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const daysInMonth = getDaysInMonth(date)
  const isDateCurrentMonth = date.getMonth() + 1 === new Date().getMonth() + 1
  const isDateFutureMonth = date.getMonth() + 1 > new Date().getMonth() + 1

  const currentDay = new Date().getDate()

  const usersWithAttendances = await getAllUsersWithAttendances()

  const usersWithAttendancesInDate = usersWithAttendances.map((user) => {
    const attendancesInDate = user.asistencias.filter((attendance) => {
      const attendanceDate = new Date(attendance.fecha_realizado)
      return (
        attendanceDate.getMonth() === date.getMonth() &&
        attendanceDate.getFullYear() === date.getFullYear() &&
        attendance.hora_entrada !== null
      )
    })

    // Función para calcular el promedio de horas
    const calculateAverageTime = (times: Date[]) => {
      if (times.length === 0) return null

      const totalMinutes = times.reduce((total, time) => {
        return total + time.getHours() * 60 + time.getMinutes()
      }, 0)

      const avgMinutes = totalMinutes / times.length
      const avgHours = Math.floor(avgMinutes / 60)
      const avgRemainingMinutes = Math.floor(avgMinutes % 60)

      return format(
        new Date(1970, 0, 1, avgHours, avgRemainingMinutes),
        'HH:mm'
      ) // Devolvemos un objeto Date con la hora promedio
    }

    const entradaTimes = attendancesInDate.map(
      (a) => new Date(a.hora_entrada || 0)
    )
    const salidaTimes = attendancesInDate.map(
      (a) => new Date(a.hora_salida || 0)
    )

    const promedioHoraEntrada = calculateAverageTime(entradaTimes)
    const promedioHoraSalida = calculateAverageTime(salidaTimes)

    return {
      ...user,
      asistencias: attendancesInDate,
      asistenciasEnTotal: attendancesInDate.length,
      faltas: isDateCurrentMonth
        ? currentDay - attendancesInDate.length
        : daysInMonth - attendancesInDate.length,
      promedioHoraEntrada,
      promedioHoraSalida,
    }
  })

  const usersWith3Faults = usersWithAttendancesInDate.filter(
    (user) => user.faltas >= 3
  )
  const usersWithLessThan3Faults = usersWithAttendancesInDate.filter(
    (user) => user.faltas < 3
  )
  console.log('usersWithAttendancesInDate', usersWithAttendancesInDate)

  return {
    fecha_actual: new Date().getDate(),
    mes_actual: new Date().getMonth() + 1,
    anio_actual: new Date().getFullYear(),
    usersWith3Faults,
    usersWithAttendancesInDate,
    usersWithLessThan3Faults,
    personnel_total: usersWithAttendancesInDate.length,
  }
}
