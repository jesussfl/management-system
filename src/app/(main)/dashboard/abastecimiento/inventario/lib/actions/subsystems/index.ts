'use server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const createSubsystem = async (
  data: Prisma.SubsistemaUncheckedCreateInput
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

  await prisma.subsistema.create({
    data,
  })

  await registerAuditAction(
    'Se creó un nuevo subsistema llamado ' + data.nombre
  )
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Subsistema creado exitosamente',
    error: false,
  }
}

export const updateSubsystem = async (
  id: number,
  data: Prisma.SubsistemaUpdateInput
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

  const exist = await prisma.subsistema.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El subsistema no existe',
      success: false,
    }
  }
  await prisma.subsistema.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'Se actualizó el subsistema llamado ' + exist?.nombre
  )
  revalidatePath('/dashboard/abastecimiento/inventario')
  return {
    success: 'Subsistema actualizado exitosamente',
    error: false,
  }
}

export const deleteSubsystem = async (id: number) => {
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

  const exist = await prisma.subsistema.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'El subsistema no existe',
      success: false,
    }
  }
  await prisma.subsistema.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se eliminó el subsistema llamado ' + exist?.nombre)

  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Subsistema eliminado exitosamente',
    error: false,
  }
}
export const deleteMultipleSubsystems = async (ids: number[]) => {
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

  await prisma.subsistema.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  await registerAuditAction(
    `Se han eliminado los siguientes subsistemas ${ids}`
  )
  revalidatePath('/dashboard/abastecimiento/inventario')

  return {
    success: 'Se han eliminado los subsistemas correctamente',
    error: false,
  }
}
export const getAllSubsystems = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const subsystems = await prisma.subsistema.findMany({
    include: {
      sistema: true,
    },
  })
  return subsystems
}

export const getSubsystemById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const subsystem = await prisma.subsistema.findUnique({
    where: {
      id,
    },
    include: {
      sistema: true,
    },
  })

  if (!subsystem) {
    throw new Error('sistema no existe')
  }
  return subsystem
}
