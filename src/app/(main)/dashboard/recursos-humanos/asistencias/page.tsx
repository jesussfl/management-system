import { PackagePlus } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { getAllAttendances } from './lib/actions'
// import ButtonExport from './components/button-export'

export const metadata: Metadata = {
  title: 'Asistencias',
  description: 'Visualiza todas las asistencias del personal',
}
export default async function Page() {
  const attendances = await getAllAttendances()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Asistencias
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todas las asistencias del personal
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={attendances} />
      </PageContent>
    </>
  )
}
