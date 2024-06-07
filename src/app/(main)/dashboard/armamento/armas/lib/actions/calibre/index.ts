'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllGunCalibers = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunCalibers = await prisma.calibre.findMany()

  return gunCalibers
}

export const getGunCaliberById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunCaliber = await prisma.calibre.findUnique({
    where: {
      id,
    },
  })

  if (!gunCaliber) {
    throw new Error('Calibre no encontrado')
  }

  return gunCaliber
}

export const createGunCaliber = async (data: Prisma.CalibreCreateInput) => {
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

  await prisma.calibre.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo calibre: ' + data.nombre)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Calibre creado exitosamente',
  }
}

export const updateGunCaliber = async (
  data: Prisma.CalibreUpdateInput,
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

  const gunCaliber = await prisma.calibre.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'Se actualizó el calibre de arma: ' + gunCaliber.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Calibre de arma actualizada exitosamente',
  }
}

export const deleteGunCaliber = async (id: number) => {
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

  const gunCaliber = await prisma.calibre.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'Se eliminó el calibre de arma: ' + gunCaliber.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Calibre de arma eliminada exitosamente',
  }
}
