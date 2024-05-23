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
  sectionName: SECTION_NAMES
  editConfig: {
    href: string
  }
  deleteConfig: {
    alertTitle: string
    alertDescription: string
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
          {editAuthorization.success && (
            <Link href={editConfig.href}>
              <DropdownMenuItem> Editar</DropdownMenuItem>
            </Link>
          )}

          {children}

          {deleteAuthorization.success && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        title={deleteConfig.alertTitle}
        description={deleteConfig.alertDescription}
        actionMethod={deleteConfig.onConfirm}
        sectionName={sectionName}
      />
    </AlertDialog>
  )
}

export default ProtectedTableActions
