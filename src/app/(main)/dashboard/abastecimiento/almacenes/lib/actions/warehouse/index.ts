'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Almacen, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllWarehouses = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const warehouses = await prisma.almacen.findMany()

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
    sectionName: SECTION_NAMES.INVENTARIO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.almacen.create({
    data,
  })

  await registerAuditAction('Se creó un nuevo almacen llamado ' + data.nombre)
  revalidatePath('/dashboard/abastecimiento/almacenes')
  return {
    success: 'Almacen creado exitosamente',
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
    sectionName: SECTION_NAMES.INVENTARIO,
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

  await registerAuditAction('Se actualizó el almacen llamado ' + exist.nombre)

  revalidatePath('/dashboard/abastecimiento/almacenes')
  return {
    error: false,
    success: 'Almacen actualizado exitosamente',
  }
}
