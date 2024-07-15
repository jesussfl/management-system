import { DownloadIcon, FolderSearch } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { getAllAuditItems } from './lib/actions'
import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { getAllUsers } from '../usuarios/lib/actions/users'
import ModalForm from '@/modules/common/components/modal-form'
import ExportAuditReport from './components/modal-export'

export const metadata: Metadata = {
  title: 'Auditoría',
  description:
    'Desde aquí puedes visualizar las acciones realizadas en el sistema',
}
export default async function Page() {
  const auditItems = await getAllAuditItems()
  const users = await getAllUsers()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <FolderSearch size={24} />
            Auditoría
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todas las acciones realizadas en el sistema
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <ModalForm
            triggerName="Exportar"
            triggerVariant="outline"
            triggerSize="sm"
            closeWarning={false}
            className="w-[400px] px-4 py-8 overflow-y-auto"
            triggerIcon={<DownloadIcon className="h-4 w-4" />}
          >
            <ExportAuditReport users={users} />
          </ModalForm>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={auditItems} />
      </PageContent>
    </>
  )
}
