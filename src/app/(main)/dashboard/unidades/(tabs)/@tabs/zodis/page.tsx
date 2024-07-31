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

import { columns as zodiColumns } from '@/app/(main)/dashboard/unidades/components/columns/zodi-columns'
import { getAllZodis } from '../../../lib/actions/zodis'

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Registra las ubicaciones militares',
}
export default async function Page() {
  const zodisData = await getAllZodis()
  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Lista de Zodis</CardTitle>
          <Link
            href="/dashboard/unidades/zodi"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Zodi
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={zodiColumns} data={zodisData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
