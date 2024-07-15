'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma, Unidad_Militar } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { registerAuditAction } from '@/lib/actions/audit'

export const getAllUnitsToCombobox = async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }

  const units = await prisma.unidad_Militar.findMany({
    select: {
      id: true,
      nombre: true,
    },
  })

  return units.map((unit) => {
    return {
      value: unit.id,
      label: unit.nombre,
    }
  })
}
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
      error: 'El nombre es requerido',
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
      error: 'El nombre de esta unidad ya existe',
      field: 'nombre',
      success: false,
    }
  }

  await prisma.unidad_Militar.create({
    data,
  })

  await registerAuditAction('CREAR', `La unidad ${data?.nombre} fue creada`)
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
    sectionName: SECTION_NAMES.UNIDADES,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exist = await prisma.unidad_Militar.findUnique({
    where: {
      id,
    },
  })

  if (!exist) {
    return {
      error: 'La unidad no existe',
      success: false,
    }
  }

  await prisma.unidad_Militar.delete({
    where: {
      id,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    `La unidad ${exist?.nombre}  fue eliminada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: 'La unidad fue eliminada',
    error: false,
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
    sectionName: SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
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
      error: 'La unidad no existe',
      success: false,
    }
  }

  await prisma.unidad_Militar.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    `La unidad ${data?.nombre}  fue actualizada`
  )
  revalidatePath('/dashboard/unidades')

  return {
    success: 'La unidad fue actualizada',
    error: false,
  }
}
