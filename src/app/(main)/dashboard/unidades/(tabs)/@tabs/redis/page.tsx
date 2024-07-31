import { buttonVariants } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import { PageContent } from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { columns as rediColumns } from '@/app/(main)/dashboard/unidades/components/columns/redi-columns'
import { getAllRedis } from '../../../lib/actions/redis'

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Registra las ubicaciones militares',
}
export default async function Page() {
  const redisData = await getAllRedis()
  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Lista de Redis</CardTitle>
          <Link
            href="/dashboard/unidades/redi"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Redi
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={rediColumns} data={redisData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
