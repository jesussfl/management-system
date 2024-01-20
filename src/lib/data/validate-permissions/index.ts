import { getUserPermissions } from '@/lib/auth'

type Params = {
  section: string
  action?: string
}

export const validateUserPermissions = async ({ section, action }: Params) => {
  const permissions = await getUserPermissions()

  const isPageAuthorized = permissions?.some((permission) =>
    permission.permiso_key.includes(section)
  )

  const isActionAuthorized = permissions?.some((permission) =>
    permission.permiso_key.includes(`${section}:${action}`)
  )

  if (!isPageAuthorized) {
    throw new Error('No tienes permisos para acceder a esta sección')
  }

  if (!isActionAuthorized && action) {
    throw new Error('No tienes permisos para realizar esta accion')
  }

  return true
}
