import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus, FileDown, PackagePlus } from 'lucide-react'
import { Metadata } from 'next'
import { Renglones } from '@/types/types'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RecibimientosFormAdd from '@/modules/recibimientos/components/form/recibimientos-form-add'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'

export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

async function getRecibimientos() {
  'use server'
  const data = await prisma.recibimientos.findMany({
    include: {
      detalles: {
        include: {
          renglon: true,
        },
      },
    },
  })
  return data
}

async function getRenglones() {
  'use server'
  const data = (await prisma.renglones.findMany()) as Renglones[]
  return data
}

export default async function Page() {
  const data = await getRecibimientos()
  const renglonesData = await getRenglones()

  return (
    <PageTemplate>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Recibimientos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las entradas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
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
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={data} />
      </PageContent>
    </PageTemplate>
  )
}
