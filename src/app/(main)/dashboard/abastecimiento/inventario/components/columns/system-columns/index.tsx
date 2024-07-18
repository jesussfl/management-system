'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { Sistema } from '@prisma/client'
import { deleteSystem, recoverSystem } from '../../../lib/actions/systems'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import ProtectedTableActions from '@/modules/common/components/table-actions'

export const columns: ColumnDef<Sistema>[] = [
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
      const system = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.INVENTARIO_ABASTECIMIENTO}
          editConfig={{
            href: `/dashboard/abastecimiento/inventario/sistema/${system.id}`,
          }}
          deleteConfig={{
            isDeleted: system.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este sistema?',
            alertDescription: `Estas a punto de eliminar este sistema. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverSystem(system.id)
            },
            onConfirm: () => {
              return deleteSystem(system.id)
            },
          }}
        />
      )
    },
  },
]
