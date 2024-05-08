'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

import { Prisma } from '@prisma/client'

import { registerAuditAction } from '@/lib/actions/audit'

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
