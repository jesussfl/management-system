'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import { formatLevel } from './components/modal-export'
type AuditoriaType = Prisma.AuditoriaGetPayload<{
  include: { usuario: true }
}>

export const columns: ColumnDef<AuditoriaType>[] = [
  SELECT_COLUMN,

  {
    accessorKey: 'accion_corta',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Acción
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // max width 100
      return (
        <div className=" truncate">{row.getValue<string>('accion_corta')}</div>
      )
    },
  },
  {
    id: 'usuario',
    accessorFn: (row) =>
      `${row?.usuario?.nombre} ${row?.usuario?.tipo_cedula}-${row?.usuario?.cedula}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Usuario
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'nivel',
    accessorFn: (row) => formatLevel(row.usuario.nivel),

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nivel
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'rol',
    accessorFn: (row) => row?.usuario?.rol_nombre,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rol
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fecha_realizado',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de realización
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original?.fecha_realizado), 'dd/MM/yyyy HH:mm'),
  },
  {
    accessorKey: 'accion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // max width 100
      return <div className="text-wrap">{row.getValue<string>('accion')}</div>
    },
  },

  {
    id: 'acciones',
    cell: ({ row }) => {
      return <></>
    },
  },
]
