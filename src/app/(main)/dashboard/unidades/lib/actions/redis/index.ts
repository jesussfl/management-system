'use server'
import { auth } from '@/auth'
import { registerAuditAction } from '@/lib/actions/audit'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { Prisma, Redi } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getAllRedis = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const redis = await prisma.redi.findMany({
    include: {
      zodis: true,
    },
  })

  return redis
}

export const getRediById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const redi = await prisma.redi.findUnique({
    where: {
      id,
    },
    include: {
      zodis: true,
    },
  })

  if (!redi) {
    throw new Error('Redi not found')
  }

  return redi
}

export const createRedi = async (data: Prisma.RediCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.UNIDADES,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
      success: false,
    }
  }

  const exists = await prisma.redi.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'El nombre ya existe',
      field: 'nombre',
      success: false,
    }
  }

  await prisma.redi.create({
    data,
  })

  await registerAuditAction('CREAR', `La redi ${nombre} fue creado`)
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}

export const deleteRedi = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.UNIDADES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.redi.findUnique({
    where: {
      id,
    },
  })

  await prisma.redi.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `La redi ${exists?.nombre} fue eliminada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}

export const updateRedi = async (id: number, data: Prisma.RediUpdateInput) => {
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

  const exists = await prisma.redi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'redi not found',
      success: false,
    }
  }

  await prisma.redi.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `La redi ${exists?.nombre} fue actualizada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}
