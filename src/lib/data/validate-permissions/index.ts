import { getUserPermissions } from '@/lib/auth'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

type Params = {
  sections: SECTION_NAMES[]
  action?: string
}

export const validateSectionsAndPermissions = async ({
  sections,
  action,
}: Params) => {
  const permissions = await getUserPermissions()

  console.log('permissions', permissions, sections)
  const isPageAuthorized = permissions?.some((permission) => {
    const [permisoSection, permisoAction] = permission.permiso_key.split(':')
    return (
      sections.includes(permisoSection as SECTION_NAMES) ||
      permisoSection === 'TODAS'
    )
  })

  const isActionAuthorized = permissions?.some((permission) => {
    const [permisoSection, permisoAction] = permission.permiso_key.split(':')
    return (
      sections.includes(permisoSection as SECTION_NAMES) &&
      (permisoAction === action || permisoAction === 'FULL')
    )
  })

  if (!isPageAuthorized) {
    return false
    throw new Error('No tienes permisos para acceder a esta sección')
  }

  if (!isActionAuthorized) {
    return false
    throw new Error('No tienes permisos para realizar esta acción')
  }

  return true
}
