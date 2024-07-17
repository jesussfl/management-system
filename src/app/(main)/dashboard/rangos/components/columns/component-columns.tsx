'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { Componente_Militar } from '@prisma/client'

import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteComponent } from '@/app/(main)/dashboard/rangos/lib/actions/ranks'
import ProtectedTableActions from '@/modules/common/components/table-actions'
interface DataTableProps {
  data: Componente_Militar[]
}

export const columns: ColumnDef<Componente_Militar>[] = [
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
      const data = row.original
      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.RANGOS}
          editConfig={{
            href: `/dashboard/rangos/componente/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este componente?',
            alertDescription: `Estas a punto de eliminar este componente. Pero puedes recuperar el registro más tarde.`,
            onConfirm: () => {
              return deleteComponent(data.id)
            },
          }}
        />
      )
    },
  },
]
