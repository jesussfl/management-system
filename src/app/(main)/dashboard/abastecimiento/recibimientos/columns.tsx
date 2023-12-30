'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import TableActions from '@/modules/recibimientos/components/table-actions'

type Recibimiento = Prisma.RecibimientosGetPayload<{
  include: { detalles: { include: { renglon: true } } }
}>

export const columns: ColumnDef<Recibimiento>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'motivo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Motivo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fecha_recibimiento',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha recibido
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue<string>('fecha_recibimiento')
        ? new Date(
            row.getValue<string>('fecha_recibimiento')
          ).toLocaleDateString()
        : ''
    },
  },
  {
    accessorKey: 'detalles',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Detalles
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const string = row.original.detalles
        .map((detalle) => `${detalle.cantidad} - ${detalle.renglon?.nombre}`)
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const recibimiento = row.original

      return <TableActions id={recibimiento.id} />
    },
  },
]
