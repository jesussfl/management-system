'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'
import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Usuario } from '@prisma/client'
import Link from 'next/link'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { updateUserState } from './lib/actions/users'

export const columns: ColumnDef<Usuario>[] = [
  SELECT_COLUMN,

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
    id: 'hasPassword',
    accessorFn: (row) => {
      return row.contrasena ? 'Si' : 'No'
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Posee contraseña
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'hasFacialId',
    accessorFn: (row) => {
      return row.facialID ? 'Si' : 'No'
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Posee ID Facial
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
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        Activo: 'bg-green-500',

        Bloqueado: 'bg-red-500',
      }
      return (
        <div className="w-32 flex gap-2 items-center">
          <div
            className={` rounded-full w-2 h-2 ${COLORS[estado || 'Activo']}`}
          />{' '}
          {estado}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Correo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'rol_nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rol
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'createdAt',
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
      format(new Date(row.original?.createdAt), 'dd/MM/yyyy HH:mm'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      const estado = user.estado
      const hasFacialId = user.facialID !== null
      const hasPassword = user.contrasena !== null
      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.USUARIOS}
          editConfig={{
            actionName: 'Editar Rol',
            href: `/dashboard/usuarios/editar-usuario/${user.id}`,
          }}
          // @ts-expect-error
          deleteConfig={{
            actionName: `${estado === 'Activo' ? 'Bloquear' : 'Desbloquear'}`,
            alertTitle: `¿Estás seguro de ${
              estado === 'Activo' ? 'bloquear' : 'desbloquear'
            } a este usuario?`,
            alertDescription: `Estas a punto de ${
              estado === 'Bloqueado' ? 'bloquear' : 'desbloquear'
            } este usuario.`,
            onConfirm: () => {
              return updateUserState(
                user.id,
                `${estado === 'Activo' ? 'Bloqueado' : 'Activo'}`
              )
            },
          }}
        >
          <Link href={`/dashboard/usuarios/cambiar-contrasena/${user.id}`}>
            <DropdownMenuItem>
              {hasPassword ? 'Cambiar contraseña' : 'Asignar contraseña'}
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/usuarios/cambiar-facialID/${user.id}`}>
            <DropdownMenuItem>Asignar ID facial</DropdownMenuItem>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
