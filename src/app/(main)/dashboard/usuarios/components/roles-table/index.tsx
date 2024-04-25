'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'

import { Prisma } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
type Rol = Prisma.RolGetPayload<{
  include: {
    permisos: true
  }
}>

export const columns: ColumnDef<Rol>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todas las filas"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar la fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rol',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rol
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('rol')}</div>,
  },
  {
    accessorKey: 'descripcion',
    header: () => <div className="text-left">Descripcion</div>,
    cell: ({ row }) => <div>{row.getValue('descripcion')}</div>,
  },
  {
    accessorKey: 'permisos',
    header: () => <div className="text-left">Permisos</div>,
    cell: ({ row }) => {
      const { permisos } = row.original
      return (
        <div className="">
          {permisos.map((permiso) => permiso.permiso_key).join(', ')}
        </div>
      )
    },
  },
  {
    id: 'acciones',
    enableHiding: false,
    cell: ({ row }) => {
      const rol = row.original
      return (
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
              onClick={() => navigator.clipboard.writeText(String(rol.id))}
            >
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link href={`/dashboard/usuarios/rol/${rol.id}`}>
              <DropdownMenuItem> Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
