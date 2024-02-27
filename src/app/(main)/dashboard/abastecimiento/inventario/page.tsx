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
import { validateUserPermissions } from '@/lib/data/validate-permissions'
import { getAllItems } from '@/lib/actions/items'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { ClassificationsTable } from '@/modules/inventario/components/classification-table'
import { getAllClassifications } from '@/lib/actions/classifications'
import { CategoriesTable } from '@/modules/inventario/components/categories-table'
import ClassificationsForm from '@/modules/inventario/components/classification-form'
import CategoriesForm from '@/modules/inventario/components/categories-form'
import { getAllCategories } from '@/lib/actions/categories'
import { getAllPackagingUnits } from '@/lib/actions/packaging-units'
import { PackagingUnitsTable } from '@/modules/inventario/components/packaging-units-table'
import PackagingUnitsForm from '@/modules/inventario/components/packaging-units-form'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const isAuthorized = await validateUserPermissions({
    section: SECTION_NAMES.INVENTARIO,
  })

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
            <div className="flex w-full gap-8 p-3">
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Clasificaciones</h4>
                  <ModalForm
                    triggerName="Nueva clasificación"
                    triggerVariant="secondary"
                  >
                    <ClassificationsForm />
                  </ModalForm>
                </div>
                <ClassificationsTable data={classificationsData} />
              </div>
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Categorías</h4>
                  <ModalForm
                    triggerName="Nueva categoría"
                    triggerVariant="secondary"
                  >
                    <CategoriesForm />
                  </ModalForm>
                </div>
                <CategoriesTable data={categoriesData} />
              </div>
            </div>
          </PageContent>
        </TabsContent>
        <TabsContent value="packagingUnits">
          <PageContent>
            <div className="flex justify-between">
              <h4 className="font-semibold">Lista de Unidades de Empaque</h4>
              <ModalForm
                triggerName="Nueva Unidad de Empaque"
                triggerVariant="secondary"
              >
                <PackagingUnitsForm />
              </ModalForm>
            </div>
            <PackagingUnitsTable data={packagingUnitsData} />
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
