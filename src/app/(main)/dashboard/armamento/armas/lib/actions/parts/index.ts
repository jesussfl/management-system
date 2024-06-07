'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllGunParts = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunParts = await prisma.parte_Arma.findMany()

  return gunParts
}

export const getGunPartById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunPart = await prisma.parte_Arma.findUnique({
    where: {
      id,
    },
  })

  if (!gunPart) {
    throw new Error('Parte no encontrado')
  }

  return gunPart
}

export const createGunPart = async (
  data: Prisma.Parte_ArmaUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.parte_Arma.create({
    data,
  })

  await registerAuditAction('Se creó una nueva parte de arma: ' + data.nombre)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Parte creada exitosamente',
  }
}

export const updateGunPart = async (
  data: Prisma.Parte_ArmaUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const gunPart = await prisma.parte_Arma.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction('Se actualizó la parte de arma: ' + gunPart.nombre)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Parte de arma actualizada exitosamente',
  }
}

export const deleteGunPart = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const gunPart = await prisma.parte_Arma.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se eliminó la parte de arma: ' + gunPart.nombre)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Parte de arma eliminada exitosamente',
  }
}
