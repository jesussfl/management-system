'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllGunTypes = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunTypes = await prisma.tipo_Armamento.findMany()

  return gunTypes
}

export const getGunTypeById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunType = await prisma.tipo_Armamento.findUnique({
    where: {
      id,
    },
  })

  if (!gunType) {
    throw new Error('Tipo de arma no encontrado')
  }
  return gunType
}

export const createGunType = async (
  data: Prisma.Tipo_ArmamentoUncheckedCreateInput
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

  const gunType = await prisma.tipo_Armamento.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    'Se creó un nuevo tipo de arma: ' + gunType.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Tipo creado exitosamente',
  }
}

export const updateGunType = async (
  data: Prisma.Tipo_ArmamentoUpdateInput,
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

  const gunType = await prisma.tipo_Armamento.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    'Se actualizó el tipo de arma: ' + gunType.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Tipo de arma actualizada exitosamente',
  }
}

export const deleteGunType = async (id: number) => {
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

  const gunType = await prisma.tipo_Armamento.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    'Se eliminó el tipo de arma: ' + gunType.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Tipo de arma eliminada exitosamente',
  }
}
