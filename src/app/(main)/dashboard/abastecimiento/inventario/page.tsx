import { columns } from './columns'
import { Renglon } from '@/utils/types/types'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'

async function getData(): Promise<Renglon[]> {
  const renglones = await prisma.renglones.findMany()
  return renglones

  return [
    {
      id: '1',
      nombre: 'Sala',
      descripcion: 'Sala 1',
      existencia: 10,
      estado: 'activo',
      stock_maximo: 20,
      stock_minimo: 5,
      tipo: 'insumo',
      serial: '123456789',
      presentacion: 'unidad',
      ubicacion: 'sala 1',
      numero_parte: '1234',
      id_almacen: 1,
      inventariable: true,
    },
  ]
}
export default async function Page() {
  const data = await getData()
  return (
    <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
      <DataTable columns={columns} data={data} />
    </main>
  )
}
