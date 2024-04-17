'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma, Profesional_Abastecimiento } from '@prisma/client'
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
import { deleteDispatch } from './lib/actions/dispatches'
export type DespachoType = Prisma.DespachoGetPayload<{
  include: {
    destinatario: true
    supervisor: true
    abastecedor: true
    autorizador: true
    renglones: { include: { renglon: true; seriales: true } }
  }
}>

export const columns: ColumnDef<DespachoType>[] = [
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
  },

  {
    accessorKey: 'destinatario.cedula',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula Destinatario
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'supervisor',
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
      const data = row.getValue<Profesional_Abastecimiento>('supervisor')
      const nombres = data?.nombres
      const apellidos = data?.apellidos

      if (!nombres && !apellidos) return <div>No asignado</div>

      return <div>{data?.nombres + ' ' + data?.apellidos}</div>
    },
  },
  {
    accessorKey: 'autorizador',
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
      const data = row.getValue<Profesional_Abastecimiento>('autorizador')
      const nombres = data?.nombres
      const apellidos = data?.apellidos

      if (!nombres && !apellidos) return <div>No asignado</div>

      return <div>{data?.nombres + ' ' + data?.apellidos}</div>
    },
  },
  {
    accessorKey: 'abastecedor',
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
      const data = row.getValue<Profesional_Abastecimiento>('abastecedor')
      const nombres = data?.nombres
      const apellidos = data?.apellidos

      if (!nombres && !apellidos) return <div>No asignado</div>

      return <div>{data?.nombres + ' ' + data?.apellidos}</div>
    },
  },
  {
    accessorKey: 'fecha_despacho',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Fecha despacho
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue<string>('fecha_despacho')
        ? new Date(row.getValue<string>('fecha_despacho')).toLocaleDateString()
        : ''
    },
  },
  {
    accessorKey: 'renglones',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          renglones
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const string = row.original.renglones
        .map((renglon) => ` ${renglon.renglon?.nombre}`)
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    id: 'acciones',

    cell: ({ row }) => {
      const data = row.original

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir Menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(data.id))}
              >
                Copiar código
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                href={`/dashboard/abastecimiento/despachos/exportar/${String(
                  data.id
                )}`}
              >
                <DropdownMenuItem>Exportar</DropdownMenuItem>
              </Link>

              {/* <Link
                href={`/dashboard/abastecimiento/despachos/${String(data.id)}`}
              >
                <DropdownMenuItem> Editar</DropdownMenuItem>
              </Link> */}
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="¿Estás seguro de que quieres eliminar este despacho?"
            description="Estas a punto de eliminar este despacho y todas sus dependencias."
            actionMethod={() => deleteDispatch(data.id)}
          />
        </AlertDialog>
      )
    },
  },
]
