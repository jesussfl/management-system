'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const createSystem = async (data: Prisma.SistemaCreateInput) => {
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

  await prisma.sistema.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    'Se creó un nuevo sistema llamado: ' + data.nombre
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'sistema creado exitosamente',
  }
}

export const updateSystem = async (
  id: number,
  data: Prisma.SistemaUpdateInput
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

  const exist = await prisma.sistema.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'sistema no existe',
      success: false,
    }
  }

  await prisma.sistema.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    'Se actualizó el sistema llamado ' + exist.nombre
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'sistema actualizado exitosamente',
  }
}

export const deleteSystem = async (id: number) => {
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

  const exist = await prisma.sistema.findUnique({
    where: {
      id,
    },
  })

  await prisma.sistema.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    'Se eliminó el sistema llamado ' + exist?.nombre
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'sistema eliminado exitosamente',
  }
}

export const recoverSystem = async (id: number) => {
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

  await prisma.sistema.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })
  await registerAuditAction(
    'RECUPERAR',
    'Se recupero el sistema con el id: ' + id
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    error: false,
    success: 'sistema recuperado exitosamente',
  }
}
export const deleteMultipleSystems = async (ids: number[]) => {
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

  await prisma.sistema.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `Se han eliminado los siguientes sistemas ${ids}`
  )
  revalidatePath('/dashboard/armamento/inventario')

  return {
    success: 'Se han eliminado los sistemas correctamente',
    error: false,
  }
}
export const getAllSystems = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const systems = await prisma.sistema.findMany()
  return systems
}

export const getSystemById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const system = await prisma.sistema.findUnique({
    where: {
      id,
    },
  })

  if (!system) {
    throw new Error('sistema no existe')
  }
  return system
}
