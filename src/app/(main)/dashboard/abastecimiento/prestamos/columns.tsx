'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { deleteLoan, recoverLoan } from '@/lib/actions/loan'
import { PrestamoType } from '@/lib/types/loan-types'

export const columns: ColumnDef<PrestamoType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'seguimiento',
    accessorFn: (row) => row.estado || 'S/E',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Seguimiento
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        Devuelto: 'bg-green-500',
        Pendiente: 'bg-yellow-500',
        Prestado: 'bg-gray-500',
      }
      return (
        <div className="flex w-32 items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${COLORS[estado || 'Pendiente']}`}
          />{' '}
          {estado === 'Prestado' ? 'Prestado' : estado || 'Pendiente'}
        </div>
      )
    },
  },
  {
    accessorKey: 'motivo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Motivo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },

    cell: ({ row }) => {
      const data = row.getValue<string>('motivo')

      return <div>{data || 'S/M'}</div>
    },
  },

  {
    id: 'destinatario',
    accessorFn: (row: PrestamoType) =>
      `${row.destinatario?.grado?.abreviatura || ''} ${
        row.destinatario?.nombres
      } ${row.destinatario?.apellidos}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Destinatario
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('destinatario')

      return <div>{data}</div>
    },
  },
  {
    id: 'supervisor',
    accessorFn: (row: PrestamoType) => {
      const name = `${row.supervisor?.grado?.abreviatura || ''} ${
        row.supervisor?.nombres
      } ${row.supervisor?.apellidos}`

      if (!row.supervisor) return 'No asignado'

      return name
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Supervisor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('supervisor')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },
  {
    id: 'autorizador',
    accessorFn: (row: PrestamoType) =>
      `${row.autorizador?.grado?.abreviatura || ''} ${
        row.autorizador?.nombres
      } ${row.autorizador?.apellidos}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Autorizador
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('autorizador')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },
  {
    id: 'abastecedor',
    accessorFn: (row: PrestamoType) => {
      return `${row.abastecedor?.grado?.abreviatura || ''} ${
        row.abastecedor?.nombres
      } ${row.abastecedor?.apellidos}`
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Abastecedor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('abastecedor')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },

  {
    id: 'renglones',
    accessorFn: (row: PrestamoType) =>
      row.renglones.map((renglon) => renglon.renglon?.nombre).join(', '),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Renglones Prestados
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'detalles',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Detalles
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/abastecimiento/prestamos/detalle/${row.original.id}`}
        >
          Ver detalles
        </Link>
      )
    },
  },
  {
    accessorKey: 'fecha_prestamo',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de prestamo
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original?.fecha_prestamo), 'dd/MM/yyyy HH:mm'),
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
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.PRESTAMOS_ABASTECIMIENTO}
          disableDelete
          editConfig={{
            href: `/dashboard/abastecimiento/prestamos/${data.id}`,
          }}
          deleteConfig={{
            isDeleted: data.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este prestamo?',
            alertDescription: `Estas a punto de eliminar este prestamo. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverLoan(data.id, 'Abastecimiento')
            },
            onConfirm: () => {
              return deleteLoan(data.id, 'Abastecimiento')
            },
          }}
        >
          <Link
            href={`/dashboard/abastecimiento/prestamos/exportar/${String(
              data.id
            )}`}
          >
            <DropdownMenuItem>Exportar</DropdownMenuItem>
            <Link
              href={`/dashboard/abastecimiento/prestamos/${String(
                data.id
              )}/editar-estado`}
            >
              <DropdownMenuItem>Editar estado</DropdownMenuItem>
            </Link>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
