'use server'
import { registerAuditAction } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const createPackagingUnit = async (
  data: Prisma.UnidadEmpaqueUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data
  const exist = await prisma.unidadEmpaque.findUnique({
    where: {
      nombre,
    },
  })

  if (exist) {
    return {
      field: 'nombre',
      success: false,
      error: 'Esta Unidad de empaque ya existe',
    }
  }

  await prisma.unidadEmpaque.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    `Se ha creado la Unidad de empaque ${nombre}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Unidad de empaque creada exitosamente',
    error: false,
  }
}

export const updatePackagingUnit = async (
  id: number,
  data: Prisma.UnidadEmpaqueUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.unidadEmpaque.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      field: 'nombre',
      error: 'Esta Unidad de empaque no existe',
      success: false,
    }
  }

  await prisma.unidadEmpaque.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `Se ha actualizado la Unidad de empaque ${exist?.nombre}`
  )

  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'Unidad de empaque actualizada exitosamente',
  }
}

export const deletePackagingUnit = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.unidadEmpaque.delete({
    where: {
      id,
    },
  })

  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'Unidad de empaque eliminada exitosamente',
  }
}
export const deleteMultiplePackagingUnits = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.unidadEmpaque.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado las siguientes Unidades de empaque ${ids}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Se han eliminado las Unidades de empaque correctamente',
    error: false,
  }
}
export const getAllPackagingUnits = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const packagingUnits = await prisma.unidadEmpaque.findMany()

  return packagingUnits
}

export const getPackagingUnitById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const packagingUnit = await prisma.unidadEmpaque.findUnique({
    where: {
      id,
    },
  })

  if (!packagingUnit) {
    throw new Error('Unidad de empaque no existe')
  }
  return packagingUnit
}

export const getPackagingUnitsByCategoryId = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return []
  }

  const packagingUnits = await prisma.unidadEmpaque.findMany({
    where: {
      id_categoria: id,
    },
  })
  return packagingUnits
}
