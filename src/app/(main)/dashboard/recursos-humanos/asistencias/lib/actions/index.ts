'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

import { Prisma } from '@prisma/client'

import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const createAttendance = async (
  data: Prisma.AsistenciaUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  await prisma.asistencia.create({
    data: {
      id_usuario: data.id_usuario,
    },
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
