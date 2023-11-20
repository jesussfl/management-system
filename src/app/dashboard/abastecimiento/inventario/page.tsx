import { columns } from './columns'
import { Renglon } from '@/utils/types/types'
import { DataTable } from '@/components/ui/data-table'
import { prisma } from '@/lib/prisma'

async function getData(): Promise<Renglon[]> {
  const renglones = await prisma.renglones.findMany()
  return renglones
}
export default async function Page() {
  const data = await getData()
  return <DataTable columns={columns} data={data} />
}
