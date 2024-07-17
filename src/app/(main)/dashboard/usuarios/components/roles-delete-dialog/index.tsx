import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'

import { Label } from '@/modules/common/components/label/label'
import { Input } from '@/modules/common/components/input/input'
import { Rol } from '@prisma/client'
import { Button } from '@/modules/common/components/button'
import { deleteRol } from '@/app/(main)/dashboard/usuarios/lib/actions/roles'
import { useToast } from '@/modules/common/components/toast/use-toast'

type Props = {
  rol: Rol
  close?: () => void
}

function DeleteDialog({ rol, close }: Props) {
  const { toast } = useToast()
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Eliminar Rol - {rol.rol}</DialogTitle>
        <DialogDescription>
          Estás a punto de eliminar este rol. Pero puedes recuperar el registro
          más tarde., introduce la contraseña de administrador para borrarlo
          permanentemente.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="adminPassword" className="text-right">
            Contraseña de administrador
          </Label>
          <Input
            id="adminPassword"
            type="password"
            value="Pedro Duarte"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          variant="destructive"
          onClick={(e) => {
            e.preventDefault()
            deleteRol(rol.id).then(() => {
              toast({
                title: 'Rol eliminado',
                description: 'Rol eliminado permanentemente',
                variant: 'success',
              })
            })
            close && close()
          }}
        >
          Borrar Permanentemente
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteDialog
