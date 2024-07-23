'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'

import { Niveles_Usuarios, Prisma } from '@prisma/client'
import Link from 'next/link'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteRol, recoverRol } from '../../lib/actions/roles'
import { cn } from '@/utils/utils'
import { formatLevel } from '../../../auditoria/components/modal-export'
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
    id: 'nivel',
    accessorFn: (row) => formatLevel(row.nivel),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nivel de usuario
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
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('descripcion')}</div>,
  },
  {
    accessorKey: 'permisos',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Permisos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/usuarios/rol-permisos/${row.original.id}`}
        >
          Ver permisos
        </Link>
      )
    },
  },
  {
    id: 'acciones',
    enableHiding: false,
    cell: ({ row }) => {
      const rol = row.original
      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.USUARIOS}
          editConfig={{
            href: `/dashboard/usuarios/rol/${rol.id}`,
          }}
          deleteConfig={{
            isDeleted: rol.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este rol?',
            alertDescription: `Estas a punto de eliminar este rol. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverRol(rol.id)
            },
            onConfirm: () => {
              return deleteRol(rol.id)
            },
          }}
        />
      )
    },
  },
]
