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

import { getAllAuditItems } from './lib/actions'
import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import ButtonExport from '../abastecimiento/despachos/components/button-export'
// import ButtonExport from './components/button-export'

export const metadata: Metadata = {
  title: 'Auditoría',
  description:
    'Desde aquí puedes visualizar las acciones realizadas en el sistema',
}
export default async function Page() {
  const auditItems = await getAllAuditItems()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Auditoría
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza todas las acciones realizadas en el sistema
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <ButtonExport />
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={auditItems} />
      </PageContent>
    </>
  )
}
