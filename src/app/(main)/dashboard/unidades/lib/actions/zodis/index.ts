'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Zodi } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllZodis = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const zodis = await prisma.zodi.findMany({
    include: {
      redi: true,
    },
  })

  return zodis
}

export const getZodiById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const zodi = await prisma.zodi.findUnique({
    where: {
      id,
    },
    include: {
      redi: true,
    },
  })

  if (!zodi) {
    throw new Error('Zodi not found')
  }

  return zodi
}

export const createZodi = async (data: Prisma.ZodiUncheckedCreateInput) => {
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
      field: 'nombre',
      success: false,
    }
  }

  const exists = await prisma.zodi.findUnique({
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

  await prisma.zodi.create({
    data,
  })

  await registerAuditAction('CREAR', `La zodi ${data.nombre} fue creada`)
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}

export const deleteZodi = async (id: number) => {
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

  const exists = await prisma.zodi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Zodi not found',
      success: false,
    }
  }

  await prisma.zodi.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `La zodi ${exists?.nombre} fue recuperada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}
export const recoverZodi = async (id: number) => {
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

  const exists = await prisma.zodi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Zodi not found',
      success: false,
    }
  }

  await prisma.zodi.update({
    where: {
      id,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    `La zodi ${exists?.nombre} fue recuperada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}
export const updateZodi = async (
  id: number,
  data: Prisma.ZodiUncheckedUpdateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.UNIDADES,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.zodi.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Zodi not found',
      success: false,
    }
  }

  await prisma.zodi.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ELIMINAR',
    `La zodi ${data.nombre} fue actualizada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}
