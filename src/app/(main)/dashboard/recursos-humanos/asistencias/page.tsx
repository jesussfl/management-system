import { Calendar, DownloadIcon, PackagePlus, Settings } from 'lucide-react'
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
import ModalForm from '@/modules/common/components/modal-form'
import ExportAttendanceReport from './components/export-attendance-report'
import SwitchShowCredentials from './components/switch-show-credentials'
import { checkIfShowCredentialsEnabled } from '@/app/(attendance)/asistencias/lib/actions'
import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

export const metadata: Metadata = {
  title: 'Asistencias',
  description: 'Visualiza todas las asistencias del personal',
}
export default async function Page() {
  const usersWithAttendances = await getAllUsersWithAttendances()
  const isAuthorized = await validateSections({
    sections: [SECTION_NAMES.TODAS],
  })
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Calendar size={24} />
            Asistencias
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todas las asistencias del personal
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          {isAuthorized && (
            <ModalForm
              triggerName="Configuración"
              triggerVariant="outline"
              triggerSize="sm"
              triggerIcon={<Settings className="h-4 w-4" />}
              closeWarning={false}
              className="w-[400px] p-8"
            >
              <SwitchShowCredentials />
            </ModalForm>
          )}
          <ModalForm
            triggerName="Exportar"
            triggerVariant="outline"
            triggerSize="sm"
            closeWarning={false}
            className="w-[500px] p-8"
            triggerIcon={<DownloadIcon className="h-4 w-4" />}
          >
            <ExportAttendanceReport users={usersWithAttendances} />
          </ModalForm>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <AttendanceTable users={usersWithAttendances} />
        {/* <DataTable columns={columns} data={attendances} /> */}
      </PageContent>
    </>
  )
}
