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
import { Categoria_Militar, Componente_Militar } from '@prisma/client'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import { useState } from 'react'

import CategoriesForm from '../forms/categories-form'
import { deleteComponent, deleteGrade } from '@/lib/actions/ranks'
import ComponentsForm from '../forms/components-form'

type Props = {
  component: Componente_Militar
}

export default function TableActions({ component }: Props) {
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
            onClick={() => navigator.clipboard.writeText(String(component.id))}
          >
            Copiar código
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DialogTrigger asChild onClick={() => setDialogType('edit')}>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            asChild
            onClick={() => {
              setDialogType('delete')
              deleteComponent(component.id)
            }}
          >
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {
        dialogType === 'edit' && (
          <DialogContent className={'lg:max-w-screen-lg overflow-hidden p-0'}>
            <ComponentsForm defaultValues={component} close={toggleModal} />
          </DialogContent>
        )
        //   <DeleteDialog permiso={permiso} close={toggleModal} />
      }
    </Dialog>
  )
}
