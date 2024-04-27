'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import Link from 'next/link'
import { RenglonWithAllRelations } from '@/types/types'

import { cn } from '@/utils/utils'

export const lowStockItemsColumns: ColumnDef<RenglonWithAllRelations>[] = [
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
    accessorKey: 'stock',
    header: ({ column }) => <HeaderCell column={column} value="Stock" />,
    cell: ({ row }) => {
      const stock = row.original.recepciones.reduce(
        (total, item) => total + item.cantidad,
        0
      )

      const dispatchedSerials = row.original.despachos.reduce(
        (total, item) => total + item.seriales.length,
        0
      )

      const returnedSerials = row.original.devoluciones.reduce(
        (total, item) => total + item.seriales.length,
        0
      )

      return <div>{stock - dispatchedSerials + returnedSerials}</div>
    },
  },
  {
    accessorKey: 'peso_total',
    header: ({ column }) => <HeaderCell column={column} value="Peso Total" />,
    cell: ({ row }) => {
      const stock = row.original.recepciones.reduce(
        (total, item) => total + item.cantidad,
        0
      )
      return (
        <div>
          {`${stock * Number(row.original.peso)} 
            ${row.original.unidad_empaque.abreviacion}
          `}
        </div>
      )
    },
  },
  {
    accessorKey: 'peso',
    header: ({ column }) => (
      <HeaderCell column={column} value="Peso Por Unidad" />
    ),

    cell: ({ row }) => {
      return (
        <div>{`${row.original.peso} ${row.original.unidad_empaque.abreviacion}`}</div>
      )
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
    accessorKey: 'unidad_empaque.nombre',
    header: ({ column }) => (
      <HeaderCell column={column} value="Unidad de empaque" />
    ),
  },

  {
    accessorKey: 'stock_minimo',
    header: ({ column }) => <HeaderCell column={column} value="Stock Mínimo" />,
  },

  {
    accessorKey: 'seriales',
    header: ({ column }) => <HeaderCell column={column} value="Seriales" />,
    cell: ({ row }) => {
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/abastecimiento/inventario/serial/${row.original.id}`}
        >
          Ver seriales
        </Link>
      )
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
