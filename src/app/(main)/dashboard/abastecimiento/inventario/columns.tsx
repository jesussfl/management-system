'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Renglones } from '@/types/types'

import TableActions from '@/modules/inventario/components/table-actions'

export const columns: ColumnDef<Renglones>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => <HeaderCell column={column} value="Nombre" />,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => <HeaderCell column={column} value="Descripción" />,
  },

  {
    accessorKey: 'stock',
    header: ({ column }) => <HeaderCell column={column} value="Stock" />,
    cell: ({ row }) => {
      const stock = row.original.recibimientos.reduce(
        (total, item) => total + item.cantidad,
        0
      )

      return <div>{stock}</div>
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => <HeaderCell column={column} value="Estado" />,
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        ACTIVO: 'bg-green-500',
        DESHABILITADO: 'bg-yellow-500',
        EN_BORRADOR: 'bg-gray-500',
        ELIMINADO: 'bg-red-500',
      }
      return (
        <div className="w-32 flex gap-2 items-center">
          <div
            className={` rounded-full w-2 h-2 ${COLORS[estado || 'ACTIVO']}`}
          />{' '}
          {estado}
        </div>
      )
    },
  },
  {
    accessorKey: 'clasificacion.nombre',
    header: ({ column }) => (
      <HeaderCell column={column} value="Clasificación" />
    ),
  },
  {
    accessorKey: 'categoria.nombre',
    header: ({ column }) => <HeaderCell column={column} value="Categoría" />,
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => <HeaderCell column={column} value="Tipo" />,
  },

  {
    accessorKey: 'unidad_empaque.nombre',
    header: ({ column }) => (
      <HeaderCell column={column} value="Unidad de empaque" />
    ),
  },

  {
    accessorKey: 'numero_parte',
    header: ({ column }) => (
      <HeaderCell column={column} value="Número de parte" />
    ),
  },
  {
    accessorKey: 'stock_minimo',
    header: ({ column }) => <HeaderCell column={column} value="Stock Mínimo" />,
  },
  {
    accessorKey: 'stock_maximo',
    header: ({ column }) => <HeaderCell column={column} value="Stock Máximo" />,
  },
  {
    id: 'acciones',

    cell: ({ row }) => {
      const data = row.original
      const renglon = (({ recibimientos, ...rest }) => rest)(data)

      return <TableActions renglon={renglon} />
    },
  },
]

const HeaderCell = ({ column, value }: { column: any; value: any }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    size={'sm'}
    className="text-xs"
  >
    {value}
    <ArrowUpDown className="ml-2 h-3 w-3" />
  </Button>
)
