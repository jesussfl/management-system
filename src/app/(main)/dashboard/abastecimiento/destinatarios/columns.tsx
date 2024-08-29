'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import { DestinatarioType } from '@/types/types'
import { ArrowUpDown } from 'lucide-react'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteReceiver, recoverReceiver } from './lib/actions/receivers'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import Link from 'next/link'
import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
export const columns: ColumnDef<DestinatarioType>[] = [
  SELECT_COLUMN,

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
    id: 'cargo',
    accessorFn: (row) => row.cargo_profesional || 'No Aplica',
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
    id: 'unidad',
    accessorFn: (row) => row.unidad?.nombre || 'No Aplica',
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
    id: 'categoria',
    accessorFn: (row) => row.categoria?.nombre || 'No Aplica',
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
    id: 'grado',
    accessorFn: (row) => row.grado?.nombre || 'No Aplica',
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
    id: 'componente',
    accessorFn: (row) => row.componente?.nombre || 'No Aplica',
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
  // {
  //   id: 'Estado',
  //   accessorFn: (row) => {
  //     const fecha_eliminacion = row?.fecha_eliminacion

  //     return fecha_eliminacion ? 'Eliminados' : 'Activos'
  //   },
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       className="text-xs"
  //       size={'sm'}
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //     >
  //       Estado
  //       <ArrowUpDown className="ml-2 h-3 w-3" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.original.fecha_eliminacion
  //     const color = !status ? 'success' : 'destructive'

  //     return (
  //       <Badge variant={color} className="capitalize">
  //         {status ? 'Eliminado' : 'Activo'}
  //       </Badge>
  //     )
  //   },
  // },

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
          sectionName={SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO}
          editConfig={{
            href: `/dashboard/abastecimiento/destinatarios/${receiver.id}`,
          }}
          deleteConfig={{
            isDeleted: receiver.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este destinatario?',
            alertDescription: `Estas a punto de eliminar este destinatario. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverReceiver(receiver.id)
            },
            onConfirm: () => {
              return deleteReceiver(receiver.id)
            },
          }}
        >
          <Link
            href={`/dashboard/abastecimiento/destinatarios/estadisticas/${String(
              receiver.id
            )}`}
          >
            <DropdownMenuItem>Ver estadísticas</DropdownMenuItem>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
