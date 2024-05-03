'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { DeleteDialog } from '@/modules/common/components/delete-dialog'
import { RenglonWithAllRelations } from '@/types/types'
import { deleteReturn } from './lib/actions/returns'

type ReturnType = Prisma.DevolucionGetPayload<{
  include: { renglones: { include: { renglon: true } } }
}>

export const columns: ColumnDef<ReturnType>[] = [
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
    accessorKey: 'fecha_devolucion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha devuelto
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue<string>('fecha_devolucion')
        ? new Date(
            row.getValue<string>('fecha_devolucion')
          ).toLocaleDateString()
        : ''
    },
  },
  {
    id: 'renglones',
    accessorFn: (row) =>
      row.renglones.map((renglon) => renglon.renglon.nombre).join(', '),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Renglones recibidos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
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
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/abastecimiento/devoluciones/detalle/${row.original.id}`}
        >
          Ver detalles
        </Link>
      )
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <AlertDialog>
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

              <Link href={`/dashboard/abastecimiento/devoluciones/${data.id}`}>
                <DropdownMenuItem> Editar</DropdownMenuItem>
              </Link>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="¿Estás seguro de que quieres eliminar esta devolución?"
            description="Estas a punto de eliminar esta devolución y todas sus dependencias."
            actionMethod={() => deleteReturn(data.id)}
          />
        </AlertDialog>
      )
    },
  },
]
