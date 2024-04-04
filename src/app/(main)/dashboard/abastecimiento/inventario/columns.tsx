'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import ModalForm from '@/modules/common/components/modal-form'
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

type RenglonType = Prisma.RenglonGetPayload<{
  include: {
    subsistema: true
    recepciones: {
      include: {
        seriales: true
      }
    }
    unidad_empaque: true
    despachos: {
      include: {
        seriales: true
      }
    }
  }
}>

export const columns: ColumnDef<RenglonType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => <HeaderCell column={column} value="Nombre" />,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => <HeaderCell column={column} value="Descripción" />,
  },

  {
    accessorKey: 'stock',
    header: ({ column }) => <HeaderCell column={column} value="Stock" />,
    cell: ({ row }) => {
      const stock = row.original.recepciones.reduce(
        (total, item) => total + item.cantidad,
        0
      )

      const dispatchedSerials = row.original.despachos.reduce(
        (total, item) => total + item.seriales.length,
        0
      )

      return <div>{stock - dispatchedSerials}</div>
    },
  },
  {
    accessorKey: 'peso_total',
    header: ({ column }) => <HeaderCell column={column} value="Peso Total" />,
    cell: ({ row }) => {
      const stock = row.original.recepciones.reduce(
        (total, item) => total + item.cantidad,
        0
      )
      return (
        <div>
          {`${stock * Number(row.original.peso)} 
            ${row.original.unidad_empaque.abreviacion}
          `}
        </div>
      )
    },
  },
  {
    accessorKey: 'peso',
    header: ({ column }) => (
      <HeaderCell column={column} value="Peso Por Unidad" />
    ),

    cell: ({ row }) => {
      return (
        <div>{`${String(row.original.peso)} ${
          row.original.unidad_empaque.abreviacion
        }`}</div>
      )
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => <HeaderCell column={column} value="Estado" />,
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        ACTIVO: 'bg-green-500',
        DESHABILITADO: 'bg-yellow-500',
        EN_BORRADOR: 'bg-gray-500',
        ELIMINADO: 'bg-red-500',
      }
      return (
        <div className="w-32 flex gap-2 items-center">
          <div
            className={` rounded-full w-2 h-2 ${COLORS[estado || 'ACTIVO']}`}
          />{' '}
          {estado}
        </div>
      )
    },
  },
  {
    accessorKey: 'clasificacion.nombre',
    header: ({ column }) => (
      <HeaderCell column={column} value="Clasificación" />
    ),
  },
  {
    accessorKey: 'categoria.nombre',
    header: ({ column }) => <HeaderCell column={column} value="Categoría" />,
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => <HeaderCell column={column} value="Tipo" />,
  },

  {
    accessorKey: 'unidad_empaque.nombre',
    header: ({ column }) => (
      <HeaderCell column={column} value="Unidad de empaque" />
    ),
  },
  {
    accessorKey: 'subsistema.nombre',
    header: ({ column }) => <HeaderCell column={column} value="Subsistema" />,
  },
  {
    accessorKey: 'numero_parte',
    header: ({ column }) => (
      <HeaderCell column={column} value="Número de parte" />
    ),
  },
  {
    accessorKey: 'stock_minimo',
    header: ({ column }) => <HeaderCell column={column} value="Stock Mínimo" />,
  },
  {
    accessorKey: 'stock_maximo',
    header: ({ column }) => <HeaderCell column={column} value="Stock Máximo" />,
  },
  {
    accessorKey: 'seriales',
    header: ({ column }) => <HeaderCell column={column} value="Seriales" />,
    cell: ({ row }) => {
      const renglones = row.original.recepciones.map((renglon) => renglon)
      const seriales = renglones.flatMap((renglon) => renglon.seriales)
      if (seriales.length === 0) {
        return <div>No hay seriales</div>
      }
      return (
        <ModalForm
          triggerName="Ver seriales"
          triggerVariant="outline"
          closeWarning={false}
        >
          <div className="p-8">
            <div className="mb-3">Seriales</div>
            {seriales.map((serial) => (
              <div key={serial.serial} className="mb-3">
                {serial.serial}
              </div>
            ))}
          </div>
        </ModalForm>
      )
    },
  },
  {
    id: 'acciones',

    cell: ({ row }) => {
      const data = row.original
      const renglon = (({ recepciones, ...rest }) => rest)(data)

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
              onClick={() => navigator.clipboard.writeText(String(renglon.id))}
            >
              Copiar código
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link
              href={`/dashboard/abastecimiento/inventario/renglon/${renglon.id}`}
            >
              <DropdownMenuItem> Editar</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const HeaderCell = ({ column, value }: { column: any; value: any }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    size={'sm'}
    className="text-xs"
  >
    {value}
    <ArrowUpDown className="ml-2 h-3 w-3" />
  </Button>
)
