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

import { columns as componentColumns } from '@/app/(main)/dashboard/rangos/components/columns/component-columns'
import { getAllComponents } from '../../lib/actions/ranks'

export const metadata: Metadata = {
  title: 'Rangos',
  description: 'Registra los componentes, grados y categorías militares',
}
export default async function Page() {
  const componentsData = await getAllComponents()
  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Lista de Componentes Militares</CardTitle>
          <Link
            href="/dashboard/rangos/componente"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Componente
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={componentColumns} data={componentsData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
