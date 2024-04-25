import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'

import { Button } from '@/modules/common/components/button'
import { MoreHorizontal } from 'lucide-react'
import { Permiso } from '@prisma/client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import { useState } from 'react'

import DeleteDialog from '../permissions-delete-dialog'
import PermissionsForm from '../permissions-form'

type Props = {
  permiso: Permiso
}

export default function TableActions({ permiso }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogType, setDialogType] = useState('')
  const toggleModal = () => setIsOpen(!isOpen)
  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir Menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(String(permiso.id))}
          >
            Copiar código
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DialogTrigger asChild onClick={() => setDialogType('edit')}>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => setDialogType('delete')}>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogType === 'edit' ? (
        <DialogContent className={'lg:max-w-screen-lg overflow-hidden p-0'}>
          <PermissionsForm defaultValues={permiso} />
        </DialogContent>
      ) : (
        <DeleteDialog permiso={permiso} close={toggleModal} />
      )}
    </Dialog>
  )
}
