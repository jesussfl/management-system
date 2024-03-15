'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import TableActions from '@/modules/recepciones/components/table-actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
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
    cell: ({ row }) => {
      // max width 100
      return (
        <div className="max-w-[300px] truncate">
          {row.getValue<string>('motivo')}
        </div>
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
        .map(
          (renglon) =>
            `${renglon.cantidad} - ${renglon.renglon?.nombre} - precio: ${
              renglon.precio ? renglon.precio : 's/p'
            } - fabricante: ${renglon.fabricante ? renglon.fabricante : 's/f'}`
        )
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir Menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(data.id))}
            >
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link href={`/dashboard/abastecimiento/recepciones/${data.id}`}>
              <DropdownMenuItem> Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
