'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
import { Prisma } from '@prisma/client'

export const getAllSuppliers = async (onlyActives?: boolean) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const suppliers = await prisma.proveedor.findMany({
    where: {
      fecha_eliminacion: onlyActives ? null : undefined,
    },
  })
  return suppliers
}
export const createSupplier = async (data: Prisma.ProveedorCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const supplier = await prisma.proveedor.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    `Se creó un nuevo proveedor de abastecimiento con el siguiente nombre: ${data.nombre} y con el siguiente id: ${supplier.id}`
  )
  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Proveedor creado exitosamente',
    error: false,
    fields: [],
  }
}

export const updateSupplier = async (
  data: Prisma.ProveedorUpdateInput,
  id: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const supplier = await prisma.proveedor.update({
    where: {
      id,
    },
    data,
  })

  if (!supplier) {
    return {
      error: 'El proveedor no existe',
      success: false,
    }
  }

  await registerAuditAction(
    'ACTUALIZAR',
    `Se actualizó el proveedor de abastecimiento con el siguiente nombre: ${data.nombre} y con el siguiente id: ${supplier.id}`
  )

  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Proveedor actualizado exitosamente',
    error: false,
    fields: [],
  }
}

export const deleteSupplier = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.PEDIDOS_ABASTECIMIENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const supplier = await prisma.proveedor.delete({
    where: {
      id,
    },
  })

  if (!supplier) {
    return {
      error: 'El proveedor no existe',
      success: false,
    }
  }

  await registerAuditAction(
    'ELIMINAR',
    `Se elimino el proveedor con el siguiente nombre: ${supplier?.nombre} y con el siguiente id: ${supplier?.id}`
  )

  revalidatePath('/dashboard/abastecimiento/pedidos')

  return {
    success: 'Proveedor eliminado exitosamente',
    error: false,
    fields: [],
  }
}

export const getSupplierById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const supplier = await prisma.proveedor.findUnique({
    where: {
      id,
    },
  })

  if (!supplier) {
    throw new Error('El proveedor no existe')
  }

  return supplier
}
