'use server'

import { prisma } from '@/lib/prisma'

/**
 * Validates the admin password.
 *
 * @param {string} password - The password to be validated.
 * @return {string} Returns an error message if the password is incorrect.
 */
export const validateAdminPassword = async (password: string) => {
  const adminPasswordDb = await prisma.admin.findFirst({
    where: {
      state: 'Activa',
    },
  })
  console.log(adminPasswordDb)
  if (password !== adminPasswordDb?.password) {
    return 'Contraseña de administrador incorrecta'
  }

  return true
}
