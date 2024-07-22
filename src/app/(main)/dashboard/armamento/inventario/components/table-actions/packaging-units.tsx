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
import { Clasificacion, Permiso, UnidadEmpaque } from '@prisma/client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import { useState } from 'react'

//   import DeleteDialog from '../permissions-delete-dialog'
import ClassificationsForm from '@/app/(main)/dashboard/armamento/inventario/components/forms/classification-form'
import PackagingUnitsForm from '../forms/packaging-units-form'

type Props = {
  packagingUnit: UnidadEmpaque
}

//TODO: Implement DELETE DIALOG component
export default function TableActions({ packagingUnit }: Props) {
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
            onClick={() =>
              navigator.clipboard.writeText(String(packagingUnit.id))
            }
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
      {
        dialogType === 'edit' ? (
          <DialogContent className={'lg:max-w-screen-lg overflow-hidden p-0'}>
            <PackagingUnitsForm
              defaultValues={packagingUnit}
              close={toggleModal}
            />
          </DialogContent>
        ) : null
        //   <DeleteDialog permiso={permiso} close={toggleModal} />
      }
    </Dialog>
  )
}
