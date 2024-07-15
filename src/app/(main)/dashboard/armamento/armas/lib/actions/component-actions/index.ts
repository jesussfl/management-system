'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'
export const getAllGunComponents = async () => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunComponents = await prisma.componente_Arma.findMany()

  return gunComponents
}

export const getGunComponentById = async (id: number) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    throw new Error('You must be signed in to perform this action')
  }

  const gunComponent = await prisma.componente_Arma.findUnique({
    where: {
      id,
    },
  })

  return gunComponent
}

export const createGunComponent = async (
  data: Prisma.Componente_ArmaUncheckedCreateInput
) => {
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

  const gunComponent = await prisma.accesorio_Arma.create({
    data,
  })

  await registerAuditAction(
    'CREAR',
    'Se creó un nuevo componente de arma: ' + gunComponent.nombre
  )
  revalidatePath('/dashboard/armamento/armas')

  return {
    error: false,
    success: 'Componente creado exitosamente',
  }
}
