'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { Subsistema } from '@prisma/client'

import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import {
  deleteSubsystem,
  recoverSubsystem,
} from '@/app/(main)/dashboard/lib/actions/subsystems'
export const columns: ColumnDef<Subsistema>[] = [
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
    accessorKey: 'sistema.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Sistema
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'acciones',

    cell: ({ row }) => {
      const subsystem = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.INVENTARIO_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/inventario/subsistema/${subsystem.id}`,
          }}
          deleteConfig={{
            isDeleted: subsystem.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este subsistema?',
            alertDescription: `Estas a punto de eliminar este subsistema. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverSubsystem(subsystem.id)
            },
            onConfirm: () => {
              return deleteSubsystem(subsystem.id)
            },
          }}
        />
      )
    },
  },
]
