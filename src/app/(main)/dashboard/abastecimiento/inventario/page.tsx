import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import ModalForm from '@/modules/common/components/modal-form'
import { Boxes } from 'lucide-react'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import ItemsForm from '@/modules/inventario/components/items-form'

import { getAllItems } from '@/lib/actions/items'
import { getAllPackagingUnits } from '@/lib/actions/packaging-units'
import { getAllClassifications } from '@/lib/actions/classifications'
import { getAllCategories } from '@/lib/actions/categories'

import ClassificationsForm from '@/modules/inventario/components/classification-form'
import CategoriesForm from '@/modules/inventario/components/categories-form'
import PackagingUnitsForm from '@/modules/inventario/components/packaging-units-form'

import { columns as categoriesColumns } from '@/modules/inventario/components/categories-table'
import { columns as classificationsColumns } from '@/modules/inventario/components/classification-table'
import { columns as packagingUnitsColumns } from '@/modules/inventario/components/packaging-units-table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

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
          <ModalForm triggerName="Nuevo renglón">
            <ItemsForm />
          </ModalForm>
        </HeaderRightSide>
      </PageHeader>

      <Tabs defaultValue="items">
        <TabsList className="mx-5">
          <TabsTrigger value="items">Renglones</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="packagingUnits">Unidades de empaque</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <PageContent>
            <DataTable columns={columns} data={itemsData} />
          </PageContent>
        </TabsContent>
        <TabsContent value="categories">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle>Lista de Clasificaciones</CardTitle>
                  <ModalForm triggerName="Nueva clasificación">
                    <ClassificationsForm />
                  </ModalForm>
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
                  <CardTitle>Lista de Categorías</CardTitle>
                  <ModalForm triggerName="Nueva categoría">
                    <CategoriesForm />
                  </ModalForm>
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
                <CardTitle>Lista de Unidades de Empaque</CardTitle>
                <ModalForm
                  triggerName="Nueva Unidad de Empaque"
                  triggerVariant="secondary"
                  className="h-[90%]"
                >
                  <PackagingUnitsForm />
                </ModalForm>
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
