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
import { Renglones } from '@prisma/client'
import { useModal } from '@/lib/store/zustand'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RenglonesForm from '@/modules/renglones/components/renglones-form'
export default function TableActions({ renglon }: { renglon: Renglones }) {
  const { isOpen, toggleModal, closeModal } = useModal()
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
            onClick={() => navigator.clipboard.writeText(String(renglon.id))}
          >
            Copiar código
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem>Editar</DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        className={'lg:max-w-screen-lg max-h-[94%] overflow-hidden px-0'}
      >
        <DialogHeader className="px-6 pb-4 border-b border-border">
          <DialogTitle>Nuevo Renglón</DialogTitle>
          <DialogDescription>
            Agrega un nuevo renglón a la base de datos de abastecimiento
          </DialogDescription>
        </DialogHeader>

        <RenglonesForm defaultValues={renglon} />
      </DialogContent>
    </Dialog>
  )
}
