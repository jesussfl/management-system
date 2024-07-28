import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Info } from 'lucide-react'
import { TableWithExport } from '../table-with-export'
import { getLowStockItems } from '@/utils/helpers/get-low-stock-items'
import { getAllItems } from '@/app/(main)/dashboard/lib/actions/item'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const itemsData = await getAllItems(false, 'Abastecimiento')

  const lowStockItems = getLowStockItems(itemsData)

  return (
    <PageContent>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal flex  items-center">
            <Info className="mr-2 h-4 w-4" />
            Estos renglones están por debajo del stock mínimo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableWithExport itemsData={lowStockItems} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
