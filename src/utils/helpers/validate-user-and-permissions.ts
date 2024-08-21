'use server'

import { SECTION_NAMES } from '../constants/sidebar-constants'
import { validateUserSession } from './validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'

export const validateUserAndPermissions = async (
  sectionName: SECTION_NAMES,
  actionName: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'RECUPERAR'
) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return {
      ...sessionResponse,
      fields: [],
    }
  }

  const permissionsResponse = validateUserPermissions({
    sectionName,
    actionName,
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return {
      ...sessionResponse,
      fields: [],
    }
  }

  return sessionResponse
}
