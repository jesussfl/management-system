import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus, FileDown } from 'lucide-react'
import { Metadata } from 'next'
import { Renglon, Renglones } from '@/types/types'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RecibimientosFormAdd from '@/modules/recibimientos/components/form/recibimientos-form-add'

export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}
export default async function Page() {
  const data = await prisma.recibimientos.findMany({
    include: {
      detalles: {
        include: {
          renglon: true,
        },
      },
    },
  })
  const renglonesData = (await prisma.renglones.findMany()) as Renglones[]

  return (
    <>
      <div className="flex items-center justify-between mb-5 p-5 border-b">
        <h1 className="text-lg font-medium">Recibimientos</h1>
        <div className="flex gap-2">
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size={'sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Recibimiento
              </Button>
            </DialogTrigger>

            <DialogContent
              className={'lg:max-w-screen-xl overflow-y-auto max-h-[90vh] pb-0'}
            >
              <RecibimientosFormAdd renglonesData={renglonesData} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  )
}
