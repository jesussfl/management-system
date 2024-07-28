import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { Boxes, PackageMinus, PackagePlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { Badge } from '@/modules/common/components/badge'
import { getAllItems } from '../../../lib/actions/item'
import { getLowStockItems } from '@/utils/helpers/get-low-stock-items'

export default async function Layout({
  modal,
  children,
  classification_and_category,
  low_stock_items,
  systems_and_subsystems,
  packaging_units,
}: {
  modal: React.ReactNode
  children: React.ReactNode
  classification_and_category: React.ReactNode
  low_stock_items: React.ReactNode
  systems_and_subsystems: React.ReactNode
  packaging_units: React.ReactNode
}) {
  const isAuthorized = await validateSections({
    sections: [
      SECTION_NAMES.INVENTARIO_ABASTECIMIENTO,
      SECTION_NAMES.ABASTECIMIENTO,
    ],
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }

  const itemsData = await getAllItems(false, 'Abastecimiento')

  const lowStockItems = getLowStockItems(itemsData)
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

          {lowStockItems.length > 0 && (
            <TabsTrigger value="lowStock">
              <Badge variant="destructive">Ver Renglones con Stock Bajo</Badge>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="items">{children}</TabsContent>
        <TabsContent value="categories">
          {classification_and_category}
        </TabsContent>
        <TabsContent value="packagingUnits">{packaging_units}</TabsContent>
        <TabsContent value="systems">{systems_and_subsystems}</TabsContent>
        <TabsContent value="lowStock">{low_stock_items}</TabsContent>
      </Tabs>
      {modal}
    </>
  )
}
