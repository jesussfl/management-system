'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import TableActions from './table-actions'
import { DestinatarioType } from '@/types/types'

export const columns: ColumnDef<DestinatarioType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'cedula',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'nombres',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Nombres
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'apellidos',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Apellidos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'telefono',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Teléfono
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  ,
  {
    accessorKey: 'situacion_profesional',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Situación profesional
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'unidad.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unidad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'categoria.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoría
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'grado.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Grado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'componente.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Componente
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const receiver = row.original

      return <TableActions cedula={receiver.cedula} data={receiver} />
    },
  },
]
