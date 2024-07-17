import { Badge } from '@/modules/common/components/badge'
import { Button } from '@/modules/common/components/button'
import { ArrowUpDown } from 'lucide-react'

export const STATUS_COLUMN: any = {
  id: 'Estado',
  accessorFn: (row: any) => {
    const fecha_eliminacion = row?.fecha_eliminacion

    return fecha_eliminacion ? 'Eliminados' : 'Activos'
  },
  header: ({ column }: any) => (
    <Button
      variant="ghost"
      className="text-xs"
      size={'sm'}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Estado
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  ),
  cell: ({ row }: any) => {
    const status = row.original.fecha_eliminacion
    const color = !status ? 'success' : 'destructive'

    return (
      <Badge variant={color} className="capitalize">
        {status ? 'Eliminado' : 'Activo'}
      </Badge>
    )
  },
}
