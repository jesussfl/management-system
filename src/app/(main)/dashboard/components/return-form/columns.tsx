'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { ItemsWithAllRelations } from '../../../../../lib/actions/item'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
type Renglon = ItemsWithAllRelations[number]

export const columns: ColumnDef<Renglon>[] = [
  {
    id: 'select',
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },

  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Descripcion
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'clasificacion.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Categoria
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'unidad_empaque.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Unidad de empaque
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
]
