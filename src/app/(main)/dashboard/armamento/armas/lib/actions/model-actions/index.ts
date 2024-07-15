'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllGunModelsToCombobox = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunModels = await prisma.modelo_Armamento.findMany({
    select: {
      id: true,
      nombre: true,
    },
  })

  return gunModels.map((gunModel) => ({
    value: gunModel.id,
    label: gunModel.nombre,
  }))
}
export const getAllGunModels = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunModels = await prisma.modelo_Armamento.findMany({
    include: {
      marca: true,
      tipo: true,
      calibre: true,
    },
  })

  return gunModels
}

export const getGunModelById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunModel = await prisma.modelo_Armamento.findUnique({
    where: {
      id,
    },
  })

  if (!gunModel) {
    throw new Error('Modelo no encontrado')
  }

  return gunModel
}

export const createGunModel = async (
  data: Prisma.Modelo_ArmamentoUncheckedCreateInput
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

  const gunModel = await prisma.modelo_Armamento.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    'Se creó un nuevo modelo de arma: ' + gunModel.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Modelo creado exitosamente',
  }
}

export const updateGunModel = async (
  data: Prisma.Modelo_ArmamentoUpdateInput,
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

  const gunModel = await prisma.modelo_Armamento.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    'Se actualizó la modelo de arma: ' + gunModel.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Modelo de arma actualizada exitosamente',
  }
}

export const deleteGunModel = async (id: number) => {
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

  const gunModel = await prisma.modelo_Armamento.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    'Se eliminó el modelo de arma: ' + gunModel.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Modelo de arma eliminada exitosamente',
  }
}
