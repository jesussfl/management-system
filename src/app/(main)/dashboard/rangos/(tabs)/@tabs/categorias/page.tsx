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

import { columns as categoryColumns } from '@/app/(main)/dashboard/rangos/components/columns/category-columns'
import { getAllCategories } from '../../../lib/actions/ranks'

export const metadata: Metadata = {
  title: 'Rangos',
  description: 'Registra los componentes, grados y categorías militares',
}
export default async function Page() {
  const categoriesData = await getAllCategories()
  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Lista de Categorias Militares</CardTitle>
          <Link
            href="/dashboard/rangos/categoria"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Categoría
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable columns={categoryColumns} data={categoriesData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
