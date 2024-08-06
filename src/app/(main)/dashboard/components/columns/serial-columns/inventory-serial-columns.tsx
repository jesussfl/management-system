'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Prisma, Serial } from '@prisma/client'
import { format } from 'date-fns'

export const inventorySerialColumns: ColumnDef<
  Prisma.SerialGetPayload<{ include: { renglon: true } }>
>[] = [
  {
    id: 'seleccionar',
  },
  {
    accessorKey: 'renglon.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'peso_actual',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Peso actual
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const measureType = row.original.renglon.tipo_medida_unidad
      const actual_weight = row.getValue('peso_actual')

      if (!actual_weight && measureType !== 'LITROS')
        return <div>No asignado</div>

      return <div>{row.getValue('peso_actual') + ' ' + measureType}</div>
    },
  },
  {
    accessorKey: 'serial',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Serial
          <CaretSortIcon className="ml-2 h-4 w-4" />
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'condicion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Condición
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    id: 'fecha_creacion',
    accessorFn: (row) =>
      format(new Date(row?.fecha_creacion), 'dd/MM/yyyy HH:mm'),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha de Registro
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => {
      return <></>
    },
  },
]
