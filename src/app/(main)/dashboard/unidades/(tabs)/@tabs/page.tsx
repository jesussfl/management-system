import { Metadata } from 'next'
import { PageContent } from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import { columns } from './columns'

import { getAllUnits } from '../../lib/actions/units'

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Registra las ubicaciones militares',
}
export default async function Page() {
  const unitsData = await getAllUnits()

  return (
    <PageContent>
      <DataTable columns={columns} data={unitsData} />
    </PageContent>
  )
}
