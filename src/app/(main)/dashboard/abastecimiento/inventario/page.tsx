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

import {
  deleteMultipleItems,
  getAllItems,
} from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import {
  deleteMultiplePackagingUnits,
  getAllPackagingUnits,
} from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/packaging-units'
import {
  deleteMultipleClassifications,
  getAllClassifications,
} from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/classifications'
import {
  deleteMultipleCategories,
  getAllCategories,
} from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/categories'
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
import { columns as subsystemColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/subsystem-columns'
import { columns as systemColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/system-columns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Boxes, PackageMinus, PackagePlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import {
  deleteMultipleSubsystems,
  getAllSubsystems,
} from './lib/actions/subsystems'
import { deleteMultipleSystems, getAllSystems } from './lib/actions/systems'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const itemsData = await getAllItems()
  const classificationsData = await getAllClassifications()
  const categoriesData = await getAllCategories()
  const packagingUnitsData = await getAllPackagingUnits()
  const systemsData = await getAllSystems()
  const subsystemsData = await getAllSubsystems()

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
            href="/dashboard/abastecimiento/recepciones/agregar"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Agregar Recepción
          </Link>

          <Link
            href="/dashboard/abastecimiento/despachos/agregar"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PackageMinus className="mr-2 h-4 w-4" />
            Agregar Despacho
          </Link>
          <Link
            href="/dashboard/abastecimiento/inventario/renglon"
            className={buttonVariants({ variant: 'default' })}
            scroll={false}
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
          <TabsTrigger value="systems">Sistemas y Subsistemas</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <PageContent>
            <Card>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={itemsData}
                  isMultipleDeleteEnabled
                  multipleDeleteAction={deleteMultipleItems}
                />
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
                  isMultipleDeleteEnabled
                  data={packagingUnitsData}
                  multipleDeleteAction={deleteMultiplePackagingUnits}
                />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="systems">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Sistemas</CardTitle>
                  <Link
                    href="/dashboard/abastecimiento/inventario/sistema"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Sistema
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={systemColumns}
                    isMultipleDeleteEnabled
                    data={systemsData}
                    multipleDeleteAction={deleteMultipleSystems}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">
                    Lista de Subsistemas
                  </CardTitle>
                  <Link
                    href="/dashboard/abastecimiento/inventario/subsistema"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Subsistema
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={subsystemColumns}
                    isMultipleDeleteEnabled
                    data={subsystemsData}
                    multipleDeleteAction={deleteMultipleSubsystems}
                  />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
