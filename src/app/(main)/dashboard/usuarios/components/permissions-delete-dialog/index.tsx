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
import { Permiso } from '@prisma/client'
import { Button } from '@/modules/common/components/button'
import { deletePermiso } from '@/app/(main)/dashboard/usuarios/lib/actions/permissions'
import { useToast } from '@/modules/common/components/toast/use-toast'

type Props = {
  permiso: Permiso
  close?: () => void
}

function DeleteDialog({ permiso, close }: Props) {
  const { toast } = useToast()
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Eliminar Permiso - {permiso.permiso}</DialogTitle>
        <DialogDescription>
          Estás a punto de eliminar este permiso y todas sus dependencias,
          introduce la contraseña de administrador para borrarlo
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
            deletePermiso(permiso.id).then(() => {
              toast({
                title: 'Permiso eliminado',
                description: 'Permiso eliminado permanentemente',
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
