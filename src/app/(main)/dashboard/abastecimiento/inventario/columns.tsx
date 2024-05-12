'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

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
import { deleteItem } from './lib/actions/items'
import { RenglonWithAllRelations } from '@/types/types'

import { cn } from '@/utils/utils'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import Image from 'next/image'
import { format } from 'date-fns'

export type RenglonColumns = {
  id: number
  nombre: string
  descripcion: string
  imagen?: string | null

  stock_minimo: number
  stock_maximo?: number
  stock: number
  seriales?: string

  numero_parte?: string
  peso_total: number

  estado: string

  unidad_empaque: string
  clasificacion: string
  categoria: string
  tipo?: string

  almacen: string

  subsistema?: string

  creado: Date
  editado: Date
}

export const columns: ColumnDef<RenglonWithAllRelations>[] = [
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
    accessorKey: 'imagen',
    header: ({ column }) => <HeaderCell column={column} value="Imagen" />,
    cell: ({ row }) => {
      const image = row.original.imagen

      if (!image) return 'Sin imágen'

      return (
        <Image
          src={row.original.imagen || ''}
          alt={row.original.imagen || ''}
          width={50}
          height={50}
        />
      )
    },
  },
  {
    accessorKey: 'stock',
    accessorFn: (row) =>
      row.recepciones.reduce((total, item) => {
        const serials = item.seriales.filter(
          (serial) =>
            serial.estado === 'Disponible' || serial.estado === 'Devuelto'
        ).length

        return total + serials
      }, 0),
    header: ({ column }) => <HeaderCell column={column} value="Stock" />,
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
        <div>{`${row.original.peso} ${row.original.unidad_empaque.abreviacion}`}</div>
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
    accessorKey: 'almacen.nombre',
    header: ({ column }) => <HeaderCell column={column} value="Almacén" />,
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
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/abastecimiento/inventario/serial/${row.original.id}`}
        >
          Ver seriales
        </Link>
      )
    },
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
      const renglon = (({ recepciones, ...rest }) => rest)(data)

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
                onClick={() =>
                  navigator.clipboard.writeText(String(renglon.id))
                }
              >
                Copiar código
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <Link
                href={`/dashboard/abastecimiento/inventario/renglon/${renglon.id}`}
              >
                <DropdownMenuItem> Editar</DropdownMenuItem>
              </Link>

              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="¿Estás seguro de que quieres eliminar este rengón?"
            description="Estas a punto de eliminar este renglon y todas sus dependencias."
            actionMethod={() => deleteItem(renglon.id)}
            sectionName={SECTION_NAMES.INVENTARIO}
          />
        </AlertDialog>
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
