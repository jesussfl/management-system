'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  MapPin,
  Package,
} from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import Link from 'next/link'
import { deleteItem, recoverItem } from '@/lib/actions/item'
import { RenglonWithAllRelations } from '@/types/types'

import { cn } from '@/utils/utils'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import Image from 'next/image'
import { format } from 'date-fns'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/modules/common/components/hover-card'

export const columns: ColumnDef<RenglonWithAllRelations>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => <HeaderCell column={column} value="Renglón" />,
    cell: ({ row }) => {
      const description = row.original?.descripcion
      const image = row.original.imagen
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center">
              {!image ? (
                <Package className="h-8 w-12" />
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Image
                      src={row.original.imagen || ''}
                      alt={row.original.imagen || ''}
                      width={50}
                      height={50}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-h-[90vh]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Imágen del Renglón</AlertDialogTitle>

                      <Image
                        src={row.original.imagen || ''}
                        alt={row.original.imagen || ''}
                        width={500}
                        height={500}
                      />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button
                variant="ghost"
                className="mr-4 flex flex-col items-start"
              >
                <p>{row.getValue<string>('nombre')}</p>
                <p className="text-xs text-gray-600">
                  {row.getValue<string>('numero_parte') || 'S/N'}
                </p>
              </Button>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 rounded-sm border border-border bg-background p-5">
            <p className="text-sm">{description}</p>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },

  {
    id: 'stock',
    accessorFn: (row) => {
      return row.stock_actual
    },
    header: ({ column }) => <HeaderCell column={column} value="Stock" />,
    cell: ({ row }) => {
      const minimumStock = row.original.stock_minimo
      const maximumStock = row.original.stock_maximo
      const stock = row.getValue<number>('stock')

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant={'link'}
              className={cn(
                'flex items-center',
                stock < minimumStock ? 'text-red-500' : ''
              )}
            >
              {stock < minimumStock ? (
                <AlertCircle className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}

              {stock}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 rounded-sm border border-border bg-background p-5">
            <p className="text-sm">Stock Minimo: {minimumStock}</p>
            <p className="text-sm">Stock Maximo: {maximumStock}</p>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    id: 'peso_total',

    header: ({ column }) => <HeaderCell column={column} value="Peso Total" />,
    cell: ({ row }) => {
      if (!row.original.stock_actual) return 'Sin stock'
      return (
        <Link
          className={cn(buttonVariants({ variant: 'outline' }))}
          href={`/dashboard/abastecimiento/inventario/renglon/${row.original.id}/peso`}
        >
          Consultar peso total
        </Link>
      )
    },
  },
  {
    id: 'peso',
    accessorFn: (row) => {
      if (!row.peso) return 'Sin definir'

      return `${row.peso || 0} ${row.tipo_medida_unidad.toLowerCase()}`
    },
    header: ({ column }) => (
      <HeaderCell column={column} value="Peso Unitario" />
    ),
  },

  {
    id: 'clasificacion',
    accessorFn: (row) => row.clasificacion.nombre,
    header: ({ column }) => (
      <HeaderCell column={column} value="Clasificación" />
    ),
  },
  {
    id: 'categoria',
    accessorFn: (row) => row.categoria.nombre,
    header: ({ column }) => <HeaderCell column={column} value="Categoría" />,
  },
  {
    accessorKey: 'tipo',
    accessorFn: (row) => row.tipo || 'Sin definir',
    header: ({ column }) => <HeaderCell column={column} value="Tipo" />,
  },
  {
    id: 'unidad_empaque',
    accessorFn: (row) => row.unidad_empaque?.nombre || 'Sin empaque',
    header: ({ column }) => <HeaderCell column={column} value="Empaque" />,
  },
  {
    id: 'subsistema',
    accessorFn: (row) => row.subsistema?.nombre || 'Sin subsistema',
    header: ({ column }) => <HeaderCell column={column} value="Subsistema" />,
  },

  {
    accessorKey: 'numero_parte',
    header: ({ column }) => (
      <HeaderCell column={column} value="Número de parte" />
    ),
  },
  {
    id: 'ubicacion',
    accessorFn: (row) => {
      const referencia = row.referencia
      const peldano = row.peldano
      const pasillo = row.pasillo
      const estante = row.estante
      const almacen = row.almacen?.nombre
      return `${referencia} - ${peldano} - ${pasillo} - ${estante} - ${
        almacen || ''
      }`
    },

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ubicación
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const referencia = row.original.referencia || 'Sin definir'
      const peldano = row.original.peldano || 'Sin definir'
      const pasillo = row.original.pasillo || 'Sin definir'
      const estante = row.original.estante || 'Sin definir'
      const almacen = row.original.almacen?.nombre || 'Sin definir'
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              <MapPin className="mr-2 h-4 w-4" /> Ver ubicación
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 rounded-sm border border-border bg-background p-5">
            <div className="space-y-1">
              <div>
                <div className="text-sm font-semibold">Almacén: {almacen}</div>
                <div className="text-sm font-semibold">Pasillo: {pasillo}</div>
                <div className="text-sm font-semibold">Estante: {estante}</div>
                <div className="text-sm font-semibold">Peldaño: {peldano}</div>
                <div className="text-sm font-semibold">
                  Punto de Referencia: {referencia}
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    id: 'seriales',
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
      const renglon = (({ ...rest }) => rest)(data)

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.INVENTARIO_ABASTECIMIENTO}
          editConfig={{
            href: `/dashboard/abastecimiento/inventario/renglon/${renglon.id}`,
          }}
          deleteConfig={{
            isDeleted: renglon.fecha_eliminacion ? true : false,
            alertTitle: '¿Estás seguro de eliminar este renglon?',
            alertDescription: `Estas a punto de eliminar este renglon. Pero puedes recuperar el registro más tarde.`,
            onRecover: () => {
              return recoverItem(renglon.id, 'Abastecimiento')
            },
            onConfirm: () => {
              return deleteItem(renglon.id, 'Abastecimiento')
            },
          }}
        />
      )
    },
  },
]

export const HeaderCell = ({ column, value }: { column: any; value: any }) => (
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
