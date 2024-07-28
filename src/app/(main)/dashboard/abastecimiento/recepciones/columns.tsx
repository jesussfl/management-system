'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'

import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import { deleteReception, recoverReception } from '../../lib/actions/reception'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import 'dayjs/plugin/utc'
import 'dayjs/plugin/duration'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/duration'))

type RecepcionType = Prisma.RecepcionGetPayload<{
  include: {
    destinatario: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    supervisor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    abastecedor: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    autorizador: {
      include: {
        grado: true
        categoria: true
        componente: true
        unidad: true
      }
    }
    renglones: { include: { renglon: true } }
  }
}>

export const columns: ColumnDef<RecepcionType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
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
      // max width 100
      return (
        <div className="max-w-[300px] truncate">
          {row.getValue<string>('motivo') || 'S/M'}
        </div>
      )
    },
  },
  {
    id: 'destinatario',
    accessorFn: (row: RecepcionType) =>
      `${row.destinatario?.grado?.abreviatura || ''} ${row.destinatario
        ?.nombres} ${row.destinatario?.apellidos}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Persona que entrega
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
    accessorFn: (row: RecepcionType) => {
      const name = `${row.supervisor?.grado?.abreviatura || ''} ${row.supervisor
        ?.nombres} ${row.supervisor?.apellidos}`

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
    accessorFn: (row: RecepcionType) =>
      `${row.autorizador?.grado?.abreviatura || ''} ${row.autorizador
        ?.nombres} ${row.autorizador?.apellidos}`,
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
    accessorFn: (row: RecepcionType) => {
      return `${row.abastecedor?.grado?.abreviatura || ''} ${row.abastecedor
        ?.nombres} ${row.abastecedor?.apellidos}`
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Recibió
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
    accessorFn: (row: RecepcionType) =>
      row.renglones.map((reception) => reception.renglon?.nombre).join(', '),

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Renglones recibidos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'fecha_recepcion',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de recepción
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original?.fecha_recepcion), 'dd/MM/yyyy HH:mm'),
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
          href={`/dashboard/abastecimiento/recepciones/detalle/${row.original.id}`}
        >
          Ver detalles
        </Link>
      )
    },
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.RECEPCIONES_ABASTECIMIENTO}
          editConfig={{
            href: `/dashboard/abastecimiento/recepciones/${data.id}`,
          }}
          // disableDelete
          disableEdit
          deleteConfig={{
            isDeleted: data.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar esta recepción?',
            alertDescription: `Estas a punto de eliminar esta recepción. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverReception(data.id)
            },
            onConfirm: () => {
              return deleteReception(data.id)
            },
          }}
        >
          <Link
            href={`/dashboard/abastecimiento/recepciones/exportar/${String(
              data.id
            )}`}
          >
            <DropdownMenuItem>Exportar</DropdownMenuItem>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
