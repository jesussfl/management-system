'use server'
import { prisma } from '@/lib/prisma'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { validateUserPermissionsArray } from '@/utils/helpers/validate-user-permissions'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { revalidatePath } from 'next/cache'

export const updateAdminPassword = async (data: {
  password: string
  confirmPassword: string
}) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissionsArray({
    sections: [SECTION_NAMES.TODAS],
    actionName: 'ACTUALIZAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const adminPassword = await prisma.admin.create({
    data: {
      password: data.password,
      state: 'Activa',
    },
  })

  // update the other password to "Inhabilitada" state

  await prisma.admin.updateMany({
    where: {
      id: {
        not: adminPassword.id,
      },
    },
    data: {
      state: 'Inhabilitada',
    },
  })

  revalidatePath('/dashboard/contrasena-administrador')

  return {
    success: 'Contraseña actualizada',
    error: false,
  }
}
