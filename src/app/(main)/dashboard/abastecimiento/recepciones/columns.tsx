'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import TableActions from '@/modules/recepciones/components/table-actions'

type RecepcionType = Prisma.RecepcionGetPayload<{
  include: { renglones: { include: { renglon: true } } }
}>

export const columns: ColumnDef<RecepcionType>[] = [
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
    accessorKey: 'fecha_recepcion',
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
      return row.getValue<string>('fecha_recepcion')
        ? new Date(row.getValue<string>('fecha_recepcion')).toLocaleDateString()
        : ''
    },
  },
  {
    accessorKey: 'renglones',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          renglones
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const string = row.original.renglones
        .map((renglon) => `${renglon.cantidad} - ${renglon.renglon?.nombre}`)
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const recepcion = row.original

      return <TableActions id={recepcion.id} />
    },
  },
]
