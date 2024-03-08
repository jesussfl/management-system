import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useToast } from '@/modules/common/components/toast/use-toast'
import { deleteDispatch } from '@/lib/actions/dispatches'
import { Despacho, Prisma } from '@prisma/client'
import Link from 'next/link'

type DespachoType = Prisma.DespachoGetPayload<{
  include: { renglones: { include: { renglon: true; seriales: true } } }
}>
export default function TableActions({
  id,
  data,
}: {
  id: number
  data: DespachoType
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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(id))}
        >
          Copiar código
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <Link href={`/dashboard/abastecimiento/despachos/${id}`}>
            Editar Despacho
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() =>
            deleteDispatch(id).then(() =>
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
