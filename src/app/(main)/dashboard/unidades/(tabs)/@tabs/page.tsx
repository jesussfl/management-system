import { Metadata } from 'next'
import { PageContent } from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from './columns'

import { getAllUnits } from '../../lib/actions/units'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { buttonVariants } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Registra las ubicaciones militares',
}
export default async function Page() {
  const unitsData = await getAllUnits()

  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Lista de Unidades</CardTitle>
          <Link
            href="/dashboard/unidades/agregar"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Unidad
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={unitsData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
