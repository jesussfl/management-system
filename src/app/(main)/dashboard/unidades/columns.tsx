'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import { DestinatarioType, UnidadesType } from '@/types/types'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteUnit } from './lib/actions/units'

export const columns: ColumnDef<UnidadesType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Descripción
          <ArrowUpDown className="ml-2 h-3 w-3" />
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
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ubicación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'acciones',
    cell: ({ row }) => {
      const unit = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.UNIDADES}
          editConfig={{
            href: `/dashboard/unidades/${unit.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar esta unidad?',
            alertDescription: `Estas a punto de eliminar este unidad y todas sus dependencias.`,
            onConfirm: () => {
              return deleteUnit(unit.id)
            },
          }}
        />
      )
    },
  },
]
