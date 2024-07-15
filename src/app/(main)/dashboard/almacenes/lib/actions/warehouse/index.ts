'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Almacen, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllWarehousesToCombobox = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouses = await prisma.almacen.findMany({
    select: {
      id: true,
      nombre: true,
    },
  })

  return warehouses.map((warehouse) => ({
    value: warehouse.id,
    label: warehouse.nombre,
  }))
}
export const getAllWarehouses = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouses = await prisma.almacen.findMany({
    include: {
      unidad: true,
    },
  })

  return warehouses
}

export const getWarehouseById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouse = await prisma.almacen.findUnique({
    where: {
      id,
    },
  })

  if (!warehouse) {
    throw new Error('Warehouse not found')
  }

  return warehouse
}

export const createWarehouse = async (data: Prisma.AlmacenCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ALMACENES,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.almacen.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    'Se creó un nuevo almacen llamado: ' + data.nombre
  )
  revalidatePath('/dashboard/almacenes')
  return {
    success: 'Almacen creado exitosamente',
    error: false,
  }
}
export const deleteWarehouse = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ALMACENES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.almacen.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El almacén no existe',
      success: false,
    }
  }

  await prisma.almacen.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se eliminó el almacén: ${exist?.nombre} con ID: ${exist?.id}`
  )
  revalidatePath('/dashboard/almacenes')

  return {
    success: 'Almacén eliminado exitosamente',
    error: false,
  }
}
export const deleteMultipleWarehouses = async (ids: number[]) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ALMACENES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.almacen.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado las siguientes almacenes ${ids}`
  )
  revalidatePath('/dashboard/almacenes')

  return {
    success: 'Se han eliminado los almacenes correctamente',
    error: false,
  }
}
export const updateWarehouse = async (
  id: number,
  data: Prisma.AlmacenUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ALMACENES,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.almacen.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'Almacen no existe',
      success: false,
    }
  }

  await prisma.almacen.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    'Se actualizó el almacen llamado ' + exist.nombre
  )

  revalidatePath('/dashboard/almacenes')
  return {
    error: false,
    success: 'Almacen actualizado exitosamente',
  }
}
