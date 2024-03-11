'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import TableActions from './table-actions'

type DespachoType = Prisma.DespachoGetPayload<{
  include: { renglones: { include: { renglon: true; seriales: true } } }
}>

export const columns: ColumnDef<DespachoType>[] = [
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
    accessorKey: 'destinatario.cedula',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula Destinatario
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fecha_despacho',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha despacho
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue<string>('fecha_despacho')
        ? new Date(row.getValue<string>('fecha_despacho')).toLocaleDateString()
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
        .map((renglon) => ` ${renglon.renglon?.nombre}`)
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const dispatch = row.original

      return <TableActions id={dispatch.id} data={dispatch} />
    },
  },
]
