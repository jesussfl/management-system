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
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import ProtectedTableActions from '@/modules/common/components/table-actions'
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
        <ProtectedTableActions
          sectionName={SECTION_NAMES.INVENTARIO}
          editConfig={{
            href: `/dashboard/abastecimiento/inventario/unidad-empaque/${packagingUnit.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar esta unidad de empaque?',
            alertDescription: `Estas a punto de eliminar esta unidad de empaque y todas sus dependencias.`,
            onConfirm: () => {
              return deletePackagingUnit(packagingUnit.id)
            },
          }}
        />
      )
    },
  },
]
