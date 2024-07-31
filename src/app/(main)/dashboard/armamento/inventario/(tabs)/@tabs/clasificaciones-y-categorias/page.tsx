import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import {
  deleteMultipleClassifications,
  getAllClassifications,
} from '@/app/(main)/dashboard/lib/actions/classifications'
import {
  deleteMultipleCategories,
  getAllCategories,
} from '@/app/(main)/dashboard/lib/actions/categories'

import { columns as categoriesColumns } from '@/app/(main)/dashboard/armamento/inventario/components/columns/categories-columns'
import { columns as classificationsColumns } from '@/app/(main)/dashboard/armamento/inventario/components/columns/classification-columns'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Clasificaciones y categorias',
  description: 'Desde aquí puedes ver todas las clasificaciones y categorias',
}

export default async function Page() {
  const classificationsData = await getAllClassifications()
  const categoriesData = await getAllCategories()

  return (
    <PageContent>
      <div className="flex w-full gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Lista de Clasificaciones</CardTitle>
            <Link
              href="/dashboard/armamento/inventario/clasificacion"
              className={buttonVariants({ variant: 'secondary' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Clasificación
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={classificationsColumns}
              data={classificationsData}
              isMultipleDeleteEnabled
              multipleDeleteAction={deleteMultipleClassifications}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Lista de Categorías</CardTitle>
            <Link
              href="/dashboard/armamento/inventario/categoria"
              className={buttonVariants({ variant: 'secondary' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Categoría
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={categoriesColumns}
              isMultipleDeleteEnabled
              data={categoriesData}
              multipleDeleteAction={deleteMultipleCategories}
            />
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
