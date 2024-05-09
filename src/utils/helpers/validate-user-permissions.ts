import { Roles_Permisos } from '@prisma/client'
import { SECTION_NAMES } from '../constants/sidebar-constants'

export const validateUserPermissions = ({
  sectionName,
  actionName,
  userPermissions,
}: {
  sectionName: SECTION_NAMES
  actionName: string
  userPermissions: Roles_Permisos[]
}) => {
  if (!userPermissions) {
    return {
      error: 'No tienes permisos para realizar esta acción',
      success: false,
    }
  }
  const isAllowed = userPermissions.some((permiso) => {
    if (
      permiso.permiso_key === 'TODAS:FULL' ||
      permiso.permiso_key === `TODAS:${actionName}`
    ) {
      return true
    }
    if (permiso.permiso_key === `${sectionName}:${actionName}`) {
      return true
    }
    return false
  })

  if (!isAllowed) {
    return {
      error: 'No tienes permisos para realizar esta acción',
      success: false,
    }
  }
  return {
    error: false,
    success: true,
  }
}

export const validateUserPermissionsArray = ({
  sections,
  userPermissions,
  actionName,
}: {
  sections?: SECTION_NAMES[]
  actionName: string
  userPermissions: Roles_Permisos[]
}) => {
  if (!userPermissions || !sections) {
    return {
      error: 'No tienes permisos para realizar esta acción',
      success: false,
    }
  }

  const isAllowed = sections.some((sectionName) => {
    return userPermissions.some((permiso) => {
      if (
        permiso.permiso_key === 'TODAS:FULL' ||
        permiso.permiso_key === `TODAS:${actionName}`
      ) {
        return true
      }
      if (permiso.permiso_key === `${sectionName}:${actionName}`) {
        return true
      }

      if (permiso.permiso_key === `${sectionName}:FULL`) {
        return true
      }
      return false
    })
  })

  if (!isAllowed) {
    return {
      error: 'No tienes permisos para realizar esta acción',
      success: false,
    }
  }

  return {
    error: false,
    success: true,
  }
}
