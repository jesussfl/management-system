import { columns } from './columns'

import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const data = await prisma.recibimientos.findMany({
    include: {
      detalles: true,
    },
  })
  return (
    <div className="flex-1 max-h-full m-3 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-md font-medium">Recibimientos</h1>
        <Link href={'/dashboard/abastecimiento/recibimientos/agregar'}>
          <Button variant="outline" size={'sm'}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Recibimiento
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
