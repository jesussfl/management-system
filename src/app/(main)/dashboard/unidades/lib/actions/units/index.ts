'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Unidad_Militar } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllUnits = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const units = await prisma.unidad_Militar.findMany({
    include: {
      zodi: true,
    },
  })

  return units
}

export const getUnitById = async (id: number) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const unit = await prisma.unidad_Militar.findUnique({
    where: {
      id,
    },
    include: {
      zodi: true,
    },
  })

  if (!unit) {
    throw new Error('Unit not found')
  }

  return unit
}

export const createUnit = async (data: Omit<Unidad_Militar, 'id'>) => {
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

  const { nombre } = data

  if (!nombre) {
    return {
      error: 'Name is required',
      field: 'nombre',
      success: false,
    }
  }

  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      nombre,
    },
  })

  if (exists) {
    return {
      error: 'Name already exists',
      field: 'nombre',
      success: false,
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })

  await registerAuditAction(`La unidad ${data?.nombre} fue creada`)
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}

export const deleteUnit = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.INVENTARIO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.zodi.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'Unit not found',
      success: false,
    }
  }

  await prisma.unidad_Militar.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(`La unidad ${exist?.nombre}  fue eliminada`)
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
  }
}

export const updateUnit = async (
  id: number,
  data: Prisma.Unidad_MilitarUncheckedUpdateInput
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

  const exists = await prisma.unidad_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'Unit not found',
      success: false,
    }
  }

  await prisma.unidad_Militar.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(`La unidad ${data?.nombre}  fue actualizada`)
  revalidatePath('/dashboard/unidades')

  return {
    success: true,
    error: false,
  }
}
