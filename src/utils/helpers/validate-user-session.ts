'use server'

import { auth } from '@/auth'

export const validateUserSession = async () => {
  const session = await auth()

  if (!session?.user) {
    return {
      session: null,
      error: 'Necesitas iniciar sesión para realizar esta acción',
      success: false,
    }
  }

  if (!session?.user.rol.permisos) {
    return {
      session: null,
      error: 'No tienes permisos para realizar esta acción',
      success: false,
    }
  }

  return {
    session,
    error: false,
    success: true,
  }
}
