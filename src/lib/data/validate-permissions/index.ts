import { getUserPermissions } from '@/lib/auth'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

type Params = {
  section: SECTION_NAMES
  action?: string
}

export const validateUserPermissions = async ({ section, action }: Params) => {
  const permissions = await getUserPermissions()

  const isPageAuthorized = permissions?.some((permission) => {
    const [permisoSection, permisoAction] = permission.permiso_key.split(':')
    return permisoSection === section || permisoSection === 'TODAS'
  })

  const isActionAuthorized = permissions?.some((permission) => {
    const [permisoSection, permisoAction] = permission.permiso_key.split(':')
    return (
      permisoSection === section &&
      (permisoAction === action || permisoAction === 'FULL')
    )
  })
  if (!isPageAuthorized) {
    throw new Error('No tienes permisos para acceder a esta sección')
  }

  if (!isActionAuthorized && action) {
    throw new Error('No tienes permisos para realizar esta accion')
  }

  return true
}
