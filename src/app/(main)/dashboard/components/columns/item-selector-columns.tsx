'use client'
import { ColumnDef } from '@tanstack/react-table'
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  MapPin,
  Package,
} from 'lucide-react'

import { Button } from '@/modules/common/components/button'

import { cn } from '@/utils/utils'
import Image from 'next/image'
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
import { ItemsWithAllRelations } from '@/lib/actions/item'
import { HeaderCell } from '../../abastecimiento/inventario/(tabs)/@tabs/columns'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
type Renglon = ItemsWithAllRelations[number]
export const itemSelectorColumns: ColumnDef<Renglon>[] = [
  {
    id: 'select',
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
                <Package className="w-12 h-8" />
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

              <Button variant="ghost" className="mr-4">
                {row.getValue<string>('nombre')}
              </Button>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background p-5 border border-border rounded-sm">
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
                <AlertCircle className="w-4 h-4 mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}

              {stock}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background p-5 border border-border rounded-sm">
            <p className="text-sm">Stock Minimo: {minimumStock}</p>
            <p className="text-sm">Stock Maximo: {maximumStock}</p>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    id: 'peso_total',
    accessorFn: (row) => {
      if (!row.peso) return 'Sin definir'

      const stock = row.stock_actual
      return `${
        stock * Number(row.peso)
      } ${row.tipo_medida_unidad.toLowerCase()}`
    },
    header: ({ column }) => <HeaderCell column={column} value="Peso Total" />,
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
              <MapPin className="w-4 h-4 mr-2" /> Ver ubicación
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background p-5 border border-border rounded-sm">
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
    id: 'test',
    header: ({ column }) => {
      return <></>
    },
  },
]
