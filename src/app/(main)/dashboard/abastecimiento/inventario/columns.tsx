'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Renglones } from '@/types/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'

import RowItemForm from '@/modules/inventario/components/rowitem-form'
import TableActions from '@/modules/inventario/components/table-actions'

export const columns: ColumnDef<Renglones>[] = [
  SELECT_COLUMN,
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
    // cell: ({ row }) => {
    //   return <div className="w-24">{row.getValue<string>('nombre')}</div>
    // },
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
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Stock
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = row.original.recibimientos.reduce(
        (total, item) => total + item.cantidad,
        0
      )

      return <div>{stock}</div>
    },
  },
  {
    accessorKey: 'clasificacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Clasificacion
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'categoria',
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

  {
    accessorKey: 'unidad_empaque',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Unidad de Empaque
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'numero_parte',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Número de Parte
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'stock_minimo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Stock Minimo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'stock_maximo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="text-xs"
        >
          Stock Maximo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
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
