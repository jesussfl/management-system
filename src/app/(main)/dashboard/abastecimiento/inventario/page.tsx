import { columns } from './columns'
import { Renglon } from '@/utils/types/types'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button/button'
import { Plus } from 'lucide-react'

import Link from 'next/link'
import Modal from '@/modules/renglones/components/renglones-modal'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}
type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined
}
async function getData(): Promise<Renglon[]> {
  const data = await prisma.renglones.findMany()
  return data
}
export default async function Page({ searchParams }: SearchParamProps) {
  const data = await getData()
  const show = searchParams?.show === 'true'
  return (
    <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-md font-medium">Inventario</h1>
        <Link href="/dashboard/abastecimiento/inventario?show=true">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Renglon
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
      {show && <Modal />}
    </main>
  )
}
