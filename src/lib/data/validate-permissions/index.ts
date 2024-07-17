import { getUserPermissions } from '@/lib/auth'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

type Params = {
  sections: SECTION_NAMES[]
}

export const validateSections = async ({ sections }: Params) => {
  const permissions = await getUserPermissions()

  const isPageAuthorized = permissions?.some((permission) => {
    const [permisoSection, permisoAction] = permission.permiso_key.split(':')
    return (
      sections.includes(permisoSection as SECTION_NAMES) ||
      permisoSection === 'TODAS'
    )
  })

  if (!isPageAuthorized) {
    return false
  }

  return true
}
