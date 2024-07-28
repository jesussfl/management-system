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

import { columns as categoriesColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/categories-columns'
import { columns as classificationsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/classification-columns'

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
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const classificationsData = await getAllClassifications()
  const categoriesData = await getAllCategories()
  // const packagingUnitsData = await getAllPackagingUnits()
  // const systemsData = await getAllSystems()
  // const subsystemsData = await getAllSubsystems()

  return (
    <PageContent>
      <div className="flex w-full gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Lista de Clasificaciones</CardTitle>
            <Link
              href="/dashboard/abastecimiento/inventario/clasificacion"
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
              href="/dashboard/abastecimiento/inventario/categoria"
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
