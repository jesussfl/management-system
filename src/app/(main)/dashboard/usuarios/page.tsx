import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus, FileDown } from 'lucide-react'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}
export default async function Page() {
  const data = await prisma.user.findMany()

  return (
    <>
      <div className="flex items-center justify-between mb-5 p-5 border-b">
        <h1 className="text-lg font-medium">Usuarios</h1>
        <div className="flex gap-2">
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  )
}
