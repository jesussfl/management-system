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

import { getAllAttendances, getAllUsersWithAttendances } from './lib/actions'
import AttendanceTable from './components/attendance-table'

export const metadata: Metadata = {
  title: 'Asistencias',
  description: 'Visualiza todas las asistencias del personal',
}
export default async function Page() {
  const attendances = await getAllAttendances()
  const usersWithAttendances = await getAllUsersWithAttendances()
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
        <AttendanceTable users={usersWithAttendances} />
        {/* <DataTable columns={columns} data={attendances} /> */}
      </PageContent>
    </>
  )
}
