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
import {
  deleteCategory,
  deleteComponent,
  deleteGrade,
} from '@/lib/actions/ranks'
import ComponentsForm from '../forms/components-form'

type Props = {
  category: Categoria_Militar
}

export default function TableActions({ category }: Props) {
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
            onClick={() => navigator.clipboard.writeText(String(category.id))}
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
              deleteCategory(category.id)
            }}
          >
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {
        dialogType === 'edit' && (
          <DialogContent className={'lg:max-w-screen-lg overflow-hidden p-0'}>
            <CategoriesForm defaultValues={category} close={toggleModal} />
          </DialogContent>
        )
        //   <DeleteDialog permiso={permiso} close={toggleModal} />
      }
    </Dialog>
  )
}
