import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import { getAllItems } from '@/app/(main)/dashboard/lib/actions/item'

import {
  Card,
  CardContent,
  CardHeader,
} from '@/modules/common/components/card/card'
import { Box, PackageCheck, PackageMinus } from 'lucide-react'
import { TableWithExport } from './table-with-export'

import { getStatistics } from '../../../../lib/actions/statistics'
import StatisticCard from '@/modules/common/components/statistic-card'
import { getLowStockItems } from '@/utils/helpers/get-low-stock-items'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const itemsData = await getAllItems()

  const lowStockItems = getLowStockItems(itemsData)
  const statistics = await getStatistics('Armamento')
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
          />
        </CardContent>
      </Card>
    </PageContent>
  )
}
