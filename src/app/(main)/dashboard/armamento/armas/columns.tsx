'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteGun, recoverGun } from './lib/actions/guns'
type ArmamentoType = Prisma.ArmamentoGetPayload<{
  include: {
    modelo: { include: { tipo: true; partes: true } }
    unidad: true
    almacen: true
  }
}>

export const columns: ColumnDef<ArmamentoType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },

  {
    accessorKey: 'modelo.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Modelo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'modelo.tipo.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Tipo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'serial_canon',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Serial de Cañon
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'serial_armazon',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Serial de Armazón
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  // {
  //   accessorKey: 'fecha_fabricacion',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         size={'sm'}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //         className="text-xs"
  //       >
  //         Fecha Fabricación
  //         <ArrowUpDown className="ml-2 h-3 w-3" />
  //       </Button>
  //     )
  //   },

  //   cell: ({ row }) => {
  //     return <div>{row.getValue<string>('fecha_fabricacion')}</div>
  //   },
  // },
  {
    accessorKey: 'lugar_fabricacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Lugar de Fabricación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'color',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Color
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'numero_causa',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Numero de Causa
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'condicion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Condición
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
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'modelo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Partes
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const string = row.original.modelo.partes
        .map((parte) => `${parte.nombre}`)
        .join(', ')

      return <div className="">{string}</div>
    },
  },
  {
    accessorKey: 'unidad.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Unidad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'almacen.nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-xs"
        >
          Almacén
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },

  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.ARMAS_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/armas/${data.id}`,
          }}
          deleteConfig={{
            isDeleted: data.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este armamento?',
            alertDescription: `Estas a punto de eliminar este armamento. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverGun(data.id)
            },
            onConfirm: () => {
              return deleteGun(data.id)
            },
          }}
        />
      )
    },
  },
]
