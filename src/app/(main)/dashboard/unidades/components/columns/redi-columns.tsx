'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { Redi } from '@prisma/client'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteRedi, recoverRedi } from '../../lib/actions/redis'

export const columns: ColumnDef<Redi>[] = [
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
    accessorKey: 'ubicacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ubicacion
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  //   {
  //     accessorKey: 'redi.nombre',
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         >
  //           Redi
  //           <CaretSortIcon className="ml-2 h-4 w-4" />
  //         </Button>
  //       )
  //     },
  //   },
  {
    id: 'acciones',
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.UNIDADES}
          editConfig={{
            href: `/dashboard/unidades/redi/${data.id}`,
          }}
          deleteConfig={{
            isDeleted: data.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar esta redi?',
            alertDescription: `Estas a punto de eliminar esta redi. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverRedi(data.id)
            },
            onConfirm: () => {
              return deleteRedi(data.id)
            },
          }}
        />
      )
    },
  },
]
