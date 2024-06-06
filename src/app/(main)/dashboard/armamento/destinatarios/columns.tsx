'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import { DestinatarioType } from '@/types/types'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import { DeleteDialog } from '@/modules/common/components/delete-dialog'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteReceiver } from './lib/actions/receivers'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'
export const columns: ColumnDef<DestinatarioType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'cedula',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'nombres',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Nombres
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'apellidos',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Apellidos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'telefono',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Teléfono
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'cargo_profesional',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cargo profesional
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'direccion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dirección
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'unidad.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unidad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'categoria.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoría
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'grado.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Grado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'componente.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Componente
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fecha_creacion',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de creación
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original?.fecha_creacion), 'dd/MM/yyyy HH:mm'),
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const receiver = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.DESTINATARIOS_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/destinatarios/${receiver.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este destinatario?',
            alertDescription: `Estas a punto de eliminar este destinatario y todas sus dependencias.`,
            onConfirm: () => {
              return deleteReceiver(receiver.id)
            },
          }}
        />
      )
    },
  },
]
