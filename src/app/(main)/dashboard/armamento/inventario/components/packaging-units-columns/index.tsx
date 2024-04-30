'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { UnidadEmpaque } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { DeleteDialog } from '@/modules/common/components/delete-dialog'
import { deletePackagingUnit } from '../../lib/actions/packaging-units'
export const columns: ColumnDef<UnidadEmpaque>[] = [
  {
    id: 'seleccionar',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nombre',
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
    accessorKey: 'tipo_medida',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo de medida
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'peso',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Peso Fijo
          <CaretSortIcon className="ml-2 h-4 w-4" />
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    id: 'acciones',
    enableHiding: false,
    cell: ({ row }) => {
      const packagingUnit = row.original

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
                onClick={() =>
                  navigator.clipboard.writeText(String(packagingUnit.id))
                }
              >
                Copiar código
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <Link
                href={`/dashboard/abastecimiento/inventario/unidad-empaque/${packagingUnit.id}`}
              >
                <DropdownMenuItem> Editar</DropdownMenuItem>
              </Link>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="¿Estás seguro de que quieres eliminar esta unidad de empaque?"
            description="Estas a punto de eliminar esta unidad y todas sus dependencias"
            actionMethod={() => deletePackagingUnit(packagingUnit.id)}
          />
        </AlertDialog>
      )
    },
  },
]
