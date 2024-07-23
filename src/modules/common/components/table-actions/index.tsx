'use client'

import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { DeleteDialog } from '@/modules/common/components/delete-dialog'

import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { validateUserPermissionsArray } from '@/utils/helpers/validate-user-permissions'
import getSectionInfo from '@/utils/helpers/get-path-info'

interface TableActionProps {
  disableEdit?: boolean
  disableDelete?: boolean
  sectionName: SECTION_NAMES
  editConfig: {
    href: string
    actionName?: string
  }
  deleteConfig: {
    isDeleted?: boolean

    actionName?: string
    alertTitle: string
    alertDescription: string
    onRecover: () => Promise<{
      error: boolean | string | null
      success: boolean | string | null
    }>
    onConfirm: () => Promise<{
      error: boolean | string | null
      success: boolean | string | null
    }>
  }
  children?: React.ReactNode
}
function ProtectedTableActions({
  sectionName,
  editConfig,
  deleteConfig,
  children,
  disableEdit,
  disableDelete,
}: TableActionProps) {
  const { data: session } = useSession()
  const permissions = session?.user.rol.permisos
  const requiredSections = getSectionInfo({
    sectionName,
    property: 'requiredPermissions',
  })

  if (!permissions) {
    return null
  }

  const editAuthorization = validateUserPermissionsArray({
    sections: requiredSections,
    actionName: 'ACTUALIZAR',
    userPermissions: permissions,
  })

  const deleteAuthorization = validateUserPermissionsArray({
    sections: requiredSections,
    actionName: 'ELIMINAR',
    userPermissions: permissions,
  })

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir Menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {editAuthorization.success && !disableEdit && (
            <Link href={editConfig.href}>
              <DropdownMenuItem>
                {editConfig.actionName || 'Editar'}
              </DropdownMenuItem>
            </Link>
          )}

          {children}

          {deleteAuthorization.success && !disableDelete && (
            <AlertDialogTrigger asChild>
              {typeof deleteConfig.isDeleted === 'boolean' ? (
                <DropdownMenuItem>
                  {deleteConfig.isDeleted
                    ? 'Recuperar'
                    : deleteConfig.actionName || 'Eliminar'}
                </DropdownMenuItem>
              ) : null}
              {/* <DropdownMenuItem>
                {deleteConfig.actionName || deleteConfig.isDeleted
                  ? 'Recuperar'
                  : 'Eliminar'}
              </DropdownMenuItem> */}
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        title={
          deleteConfig.isDeleted
            ? 'Quitar de eliminados'
            : deleteConfig.alertTitle
        }
        description={
          deleteConfig.isDeleted
            ? 'Con esta acción puedes recuperar el registro'
            : deleteConfig.alertDescription
        }
        actionMethod={
          deleteConfig.isDeleted
            ? deleteConfig.onRecover
            : deleteConfig.onConfirm
        }
        sectionName={sectionName}
      />
    </AlertDialog>
  )
}

export default ProtectedTableActions
