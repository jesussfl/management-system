'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import ModalForm from '@/modules/common/components/modal-form'
import { GradosWithComponentesAndIncludeComponente } from '@/types/types'
import {
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { deleteGrade } from '@/app/(main)/dashboard/rangos/lib/actions/ranks'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
export const columns: ColumnDef<GradosWithComponentesAndIncludeComponente>[] = [
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
    accessorKey: 'abreviatura',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Abreviatura
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'orden',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Orden
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'componentes',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Componentes
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <ModalForm
          triggerName="Ver componentes"
          triggerVariant="outline"
          closeWarning={false}
          className="h-[60vh]"
        >
          <>
            <CardHeader>
              <CardTitle>Componentes relacionados</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {row.original.componentes.map((componente) => {
                return (
                  <div key={componente.id} className="flex flex-col">
                    <p>
                      {componente.id} {componente.id_grado}
                    </p>
                    <p className="font-bold">{componente.componente.nombre}</p>
                    <p>{componente.componente.descripcion}</p>
                  </div>
                )
              })}
            </CardContent>
          </>
        </ModalForm>
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
            href: `/dashboard/rangos/grado/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este grado?',
            alertDescription: `Estas a punto de eliminar este grado. Pero puedes recuperar el registro más tarde.`,
            onConfirm: () => {
              return deleteGrade(data.id)
            },
          }}
        />
      )
    },
  },
]
