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
import { DestinatarioType } from '@/types/types'
import { deleteReceiver } from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/receivers'

export default function TableActions({
  cedula,
  data,
}: {
  cedula: string
  data: DestinatarioType
}) {
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cedula)}>
          Copiar Cédula
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <Link href={`/dashboard/abastecimiento/despachos/${id}`}>
            Editar Despacho
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() =>
            deleteReceiver(cedula).then(() =>
              toast({
                title: 'Despacho eliminado',
                description: 'Se ha eliminado el despacho',
                variant: 'success',
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
