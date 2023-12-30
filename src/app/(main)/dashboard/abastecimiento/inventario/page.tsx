import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'

import { Metadata } from 'next'
import ModalForm from '@/modules/inventario/components/modal-form'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}
type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: SearchParamProps) {
  const data = await prisma.renglones.findMany({
    include: {
      recibimientos: true,
    },
  })
  return (
    <>
      <div className="flex items-center justify-between mb-5 p-5 border-b">
        <h1 className="text-lg font-medium">Inventario</h1>
        <div className="flex gap-2">
          <ModalForm />
        </div>
      </div>
      <div className="p-5">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
