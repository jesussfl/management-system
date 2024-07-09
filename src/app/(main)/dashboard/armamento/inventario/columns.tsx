'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'

import Link from 'next/link'
import { deleteItem } from './lib/actions/items'
import { RenglonWithAllRelations } from '@/types/types'

import { cn } from '@/utils/utils'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import Image from 'next/image'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'

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
    id: 'stock',
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
    id: 'peso_total',
    // accessorKey: 'peso_total',
    accessorFn: (row) => {
      if (!row.peso) return 'Sin definir'
      const stock = row.recepciones.reduce((total, item) => {
        const serials = item.seriales.filter(
          (serial) =>
            serial.estado === 'Disponible' || serial.estado === 'Devuelto'
        ).length
        return total + serials
      }, 0)
      return `${stock * Number(row.peso)} ${row.unidad_empaque.tipo_medida}`
    },
    header: ({ column }) => (
      <HeaderCell column={column} value="Peso/Unidades Totales" />
    ),
  },
  {
    id: 'peso',
    accessorFn: (row) => {
      if (!row.peso) return 'Sin definir'
      return `${row.peso || 0} ${row.unidad_empaque.abreviacion}`
    },
    header: ({ column }) => (
      <HeaderCell column={column} value="Peso Por Unidad" />
    ),

    // cell: ({ row }) => {
    //   return (
    //     <div>{`${row.original.peso} ${row.original.unidad_empaque.abreviacion}`}</div>
    //   )
    // },
  },
  // {
  //   accessorKey: 'estado',
  //   header: ({ column }) => <HeaderCell column={column} value="Estado" />,
  //   cell: ({ row }) => {
  //     const { estado } = row.original
  //     const COLORS = {
  //       ACTIVO: 'bg-green-500',
  //       DESHABILITADO: 'bg-yellow-500',
  //       EN_BORRADOR: 'bg-gray-500',
  //       ELIMINADO: 'bg-red-500',
  //     }
  //     return (
  //       <div className="w-32 flex gap-2 items-center">
  //         <div
  //           className={` rounded-full w-2 h-2 ${COLORS[estado || 'ACTIVO']}`}
  //         />{' '}
  //         {estado}
  //       </div>
  //     )
  //   },
  // },
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
    id: 'unidad_empaque',
    accessorFn: (row) => row.unidad_empaque?.nombre || 'Sin unidad de empaque',
    header: ({ column }) => (
      <HeaderCell column={column} value="Unidad de empaque" />
    ),
  },
  {
    id: 'subsistema',
    accessorFn: (row) => row.subsistema?.nombre || 'Sin subsistema',
    header: ({ column }) => <HeaderCell column={column} value="Subsistema" />,
  },
  {
    accessorKey: 'almacen.nombre',
    header: ({ column }) => <HeaderCell column={column} value="Almacén" />,
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
    id: 'seriales',
    header: ({ column }) => <HeaderCell column={column} value="Seriales" />,
    cell: ({ row }) => {
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/armamento/inventario/serial/${row.original.id}`}
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
        <ProtectedTableActions
          sectionName={SECTION_NAMES.INVENTARIO_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/inventario/renglon/${renglon.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este renglon?',
            alertDescription: `Estas a punto de eliminar este renglon y todas sus dependencias.`,
            onConfirm: () => {
              return deleteItem(renglon.id)
            },
          }}
        />
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
