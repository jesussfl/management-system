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
import { useToast } from '@/modules/common/components/toast/use-toast'
import { deleteRecibimiento } from '@/lib/actions/delete-recibimiento'
export default function TableActions({ id }: { id: number }) {
  const { toast } = useToast()

  return (
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
          onClick={() => navigator.clipboard.writeText(String(id))}
        >
          Copiar código
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            deleteRecibimiento(id).then(() =>
              toast({
                title: 'Recibimiento eliminado',
                description: 'Se ha eliminado el recibimiento',
                variant: 'default',
              })
            )
          }
        >
          Eliminar registro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
