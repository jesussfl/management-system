import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'

import { Metadata } from 'next'

import ModalForm from '@/modules/inventario/components/modal-form'
import { Boxes } from 'lucide-react'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const data = await prisma.renglones.findMany({
    include: {
      recibimientos: true,
    },
  })
  return (
    <PageTemplate>
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
          <ModalForm />
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={data} />
      </PageContent>
    </PageTemplate>
  )
}
