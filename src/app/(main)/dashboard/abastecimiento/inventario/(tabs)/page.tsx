import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import { getAllItems } from '@/app/(main)/dashboard/lib/actions/item'
import {
  deleteMultiplePackagingUnits,
  getAllPackagingUnits,
} from '@/app/(main)/dashboard/lib/actions/packaging-units'
import {
  deleteMultipleClassifications,
  getAllClassifications,
} from '@/app/(main)/dashboard/lib/actions/classifications'
import {
  deleteMultipleCategories,
  getAllCategories,
} from '@/app/(main)/dashboard/lib/actions/categories'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { columns as categoriesColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/categories-columns'
import { columns as classificationsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/classification-columns'
import { columns as packagingUnitsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/packaging-units-columns'
import { columns as subsystemColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/subsystem-columns'
import { columns as systemColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/system-columns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  Box,
  Boxes,
  Info,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  Plus,
} from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import {
  deleteMultipleSubsystems,
  getAllSubsystems,
} from '../../../lib/actions/subsystems'
import {
  deleteMultipleSystems,
  getAllSystems,
} from '../../../lib/actions/systems'
import { TableWithExport } from './table-with-export'

import { Badge } from '@/modules/common/components/badge'
import { getStatistics } from '../../../lib/actions/statistics'
import StatisticCard from '@/modules/common/components/statistic-card'
import { getLowStockItems } from '@/utils/helpers/get-low-stock-items'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const itemsData = await getAllItems()
  // const classificationsData = await getAllClassifications()
  // const categoriesData = await getAllCategories()
  // const packagingUnitsData = await getAllPackagingUnits()
  // const systemsData = await getAllSystems()
  // const subsystemsData = await getAllSubsystems()
  const lowStockItems = getLowStockItems(itemsData)
  const statistics = await getStatistics('Abastecimiento')
  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row items-center gap-8 ">
          <StatisticCard
            className="flex-1 h-[116px]"
            title="Renglones Totales"
            number={statistics?.items}
            Icon={<Box size={24} />}
          />

          <StatisticCard
            className="flex-1 h-[116px]"
            title="Recepciones Creadas"
            number={statistics?.receptions}
            Icon={<PackageCheck size={24} />}
          />
          <StatisticCard
            className="flex-1 h-[116px]"
            title="Despachos Creados"
            number={statistics?.dispatches}
            Icon={<PackageMinus size={24} />}
          />
        </CardHeader>
        <CardContent>
          <TableWithExport
            itemsData={itemsData}
            lowStockItems={lowStockItems}
            // formatFn={formatExcelData}
          />
        </CardContent>
      </Card>
    </PageContent>
  )
}
