import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { FileDown, User2 } from 'lucide-react'
import { Metadata } from 'next'
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
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}
export default async function Page() {
  const data = await prisma.user.findMany()

  return (
    <>
      <PageTemplate>
        <PageHeader>
          <HeaderLeftSide>
            <PageHeaderTitle>
              <User2 size={24} />
              Usuarios
            </PageHeaderTitle>
            <PageHeaderDescription>
              Administra los usuarios registrados y sus roles
            </PageHeaderDescription>
          </HeaderLeftSide>
          <HeaderRightSide>
            <Button variant="outline" size={'sm'}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </HeaderRightSide>
        </PageHeader>
      </PageTemplate>
      <PageContent>
        <DataTable columns={columns} data={data} />
      </PageContent>
    </>
  )
}
