'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { UnidadEmpaque } from '@prisma/client'

import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import {
  deletePackagingUnit,
  recoverPackagingUnit,
} from '@/lib/actions/packaging-units'
export const columns: ColumnDef<UnidadEmpaque>[] = [
  {
    id: 'seleccionar',
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && 'indeterminate')
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Seleccionar todos"
    //   />
    // ),
    // cell: ({ row }) => (
    //   <Checkbox
    //     checked={row.getIsSelected()}
    //     onCheckedChange={(value) => row.toggleSelected(!!value)}
    //     aria-label="Seleccionar fila"
    //   />
    // ),
    // enableSorting: false,
    // enableHiding: false,
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
          sectionName={SECTION_NAMES.INVENTARIO_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/inventario/unidad-empaque/${packagingUnit.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar esta unidad de empaque?',
            alertDescription: `Estas a punto de eliminar esta unidad de empaque. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverPackagingUnit(packagingUnit.id)
            },
            onConfirm: () => {
              return deletePackagingUnit(packagingUnit.id)
            },
          }}
        />
      )
    },
  },
]
