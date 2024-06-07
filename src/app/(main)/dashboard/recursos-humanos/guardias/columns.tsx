'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import { PersonalType, ProfesionalType } from '@/types/types'
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
import { format } from 'date-fns'
import { Prisma } from '@prisma/client'
type GuardiasType = Prisma.PersonalGetPayload<{
  include: {
    guardias: true
  }
}>

export const columns: ColumnDef<GuardiasType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'Nombre_Completo',
    accessorFn: (row) => {
      const cedulaCompleta = `${row.tipo_cedula}-${row.cedula}`
      const nombresApellidos = `${row.nombres} ${row.apellidos}`
      return `${cedulaCompleta} - ${nombresApellidos}`
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula y Nombre
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
    id: 'guardias',
    accessorFn: (row) => {
      const today = new Date()
      const futurasGuardias = row.guardias.filter(
        (guardia) => new Date(guardia.fecha) >= today
      ) // Filtrar las fechas futuras

      if (futurasGuardias.length === 0) {
        return 'No hay guardias próximas'
      }

      const fechas = futurasGuardias
        .map((guardia) => format(new Date(guardia.fecha), 'dd/MM/yyyy'))
        .join(', ')

      return fechas
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fechas de guardias
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'acciones',
    cell: ({ row }) => {
      const guard = row.original

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
              onClick={() => navigator.clipboard.writeText(String(guard.id))}
            >
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link href={`/dashboard/recursos-humanos/guardias/${guard.cedula}`}>
              <DropdownMenuItem>Asignar Guardias</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

type Guardias = Prisma.GuardiaGetPayload<{
  include: {
    personal: true
  }
}>

export const guardColumns: ColumnDef<Guardias>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'Nombre_Completo',
    accessorFn: (row) => {
      const cedulaCompleta = `${row.personal.tipo_cedula}-${row.personal.cedula}`
      const nombresApellidos = `${row.personal.nombres} ${row.personal.apellidos}`
      return `${cedulaCompleta} - ${nombresApellidos}`
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cédula y Nombre
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
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ubicación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'estado',
    accessorFn: (row) => {
      const date = row.fecha
      if (date < new Date()) {
        return 'Realizada'
      } else {
        return 'Pendiente'
      }
    },
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
  },
  {
    accessorKey: 'fecha',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.original.fecha), 'dd/MM/yyyy'),
  },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const guard = row.original

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
              onClick={() => navigator.clipboard.writeText(String(guard.id))}
            >
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link
              href={`/dashboard/recursos-humanos/guardias/${guard.cedula_usuario}`}
            >
              <DropdownMenuItem>Asignar Guardias</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
