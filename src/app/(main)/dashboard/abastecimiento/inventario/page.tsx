import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import { getAllItems } from '@/lib/actions/items'
import { getAllPackagingUnits } from '@/lib/actions/packaging-units'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getAllCategories } from '@/lib/actions/categories'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { columns as categoriesColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/categories-columns'
import { columns as classificationsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/classification-columns'
import { columns as packagingUnitsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/packaging-units-columns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Boxes, Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  // const isAuthorized = await validateUserPermissions({
  //   section: SECTION_NAMES.INVENTARIO,
  // })

  const itemsData = await getAllItems()
  const classificationsData = await getAllClassifications()
  const categoriesData = await getAllCategories()
  const packagingUnitsData = await getAllPackagingUnits()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Boxes size={24} />
            Inventario
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona todos los stocks y renglones
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/abastecimiento/inventario/renglon"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Renglón
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="items">
        <TabsList className="mx-5">
          <TabsTrigger value="items">Renglones</TabsTrigger>
          <TabsTrigger value="categories">
            Clasificaciones y Categorías{' '}
          </TabsTrigger>
          <TabsTrigger value="packagingUnits">Unidades de empaque</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <PageContent>
            <Card>
              <CardContent>
                <DataTable columns={columns} data={itemsData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="categories">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">
                    Lista de Clasificaciones
                  </CardTitle>
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
                    data={categoriesData}
                  />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>
        <TabsContent value="packagingUnits">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-xl">
                  Lista de Unidades de Empaque
                </CardTitle>

                <Link
                  href="/dashboard/abastecimiento/inventario/unidad-empaque"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Unidad de Empaque
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={packagingUnitsColumns}
                  data={packagingUnitsData}
                />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
