'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllAccesories = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const accesories = await prisma.accesorio_Arma.findMany()

  return accesories
}

export const getAccessoryById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const accessory = await prisma.accesorio_Arma.findUnique({
    where: {
      id,
    },
  })

  return accessory
}

export const createAccessory = async (
  data: Prisma.Accesorio_ArmaUncheckedCreateInput
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.ARMAMENTO,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.accesorio_Arma.create({
    data,
  })

  await registerAuditAction(
    'Se creó un nuevo accesorio de arma: ' + data.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Arma creada exitosamente',
  }
}
