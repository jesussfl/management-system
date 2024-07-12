'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllGuns = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const guns = await prisma.armamento.findMany({
    include: {
      modelo: {
        include: {
          tipo: true,
          marca: true,
          partes: true,
        },
      },
      unidad: true,
      almacen: true,
    },
  })

  return guns
}

export const getGunById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gun = await prisma.armamento.findUnique({
    where: {
      id,
    },
    include: {
      modelo: {
        include: {
          marca: true,
          partes: true,
        },
      },
      unidad: true,
      almacen: true,
    },
  })

  if (!gun) {
    throw new Error('Gun not found')
  }
  return gun
}

export const createGun = async (data: Prisma.ArmamentoUncheckedCreateInput) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const gun = await prisma.armamento.create({
    data,
  })

  await registerAuditAction('Se agregó una nueva arma con el id ' + gun.id)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Arma creada exitosamente',
  }
}

export const updateGun = async (
  data: Prisma.ArmamentoUpdateInput,
  gunId: number
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.armamento.update({
    where: {
      id: gunId,
    },
    data,
  })

  await registerAuditAction('Se actualizó el arma con id: ' + gunId)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Arma creada exitosamente',
  }
}

export const deleteGun = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAS_ARMAMENTO,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.armamento.delete({
    where: {
      id,
    },
  })

  await registerAuditAction('Se eliminó el arma con el id ' + id)
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Arma eliminada exitosamente',
  }
}
