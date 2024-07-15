'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const createClassification = async (
  data: Prisma.ClasificacionCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }
  const { nombre } = data
  const exist = await prisma.clasificacion.findUnique({
    where: {
      nombre,
    },
  })
  if (exist) {
    return {
      field: 'nombre',
      success: false,
      error: 'Esta clasificación ya existe',
    }
  }

  await prisma.clasificacion.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    `Se creó una clasificación llamada: ${nombre}`
  )

  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    error: false,
    success: 'Clasificación creado exitosamente',
  }
}

export const updateClassification = async (
  id: number,
  data: Prisma.ClasificacionUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.clasificacion.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La clasificación no existe',
      success: false,
    }
  }

  await prisma.clasificacion.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó una clasificación llamada: ${exist?.nombre}`
  )
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Clasificación actualizado exitosamente',
    error: false,
  }
}

export const deleteClassification = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.clasificacion.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La clasificación no existe',
      success: false,
    }
  }

  await prisma.clasificacion.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó una clasificación llamada: ${exist?.nombre}`
  )
  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Clasificación eliminada exitosamente',
    error: false,
  }
}
export const deleteMultipleClassifications = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.clasificacion.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado las clasificaciones con los siguientes ids: ${ids}`
  )
  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Se ha eliminado la clasificación correctamente',
    error: false,
  }
}
export const getAllClassifications = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const classifications = await prisma.clasificacion.findMany()
  return classifications
}

export const getClassificationById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const classification = await prisma.clasificacion.findUnique({
    where: {
      id,
    },
  })

  if (!classification) {
    throw new Error('La clasificación no existe')
  }
  return classification
}
