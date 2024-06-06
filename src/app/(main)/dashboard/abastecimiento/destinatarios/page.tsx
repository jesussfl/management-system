import { buttonVariants } from '@/modules/common/components/button'
import { UserSquare2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import Link from 'next/link'
import { columns } from './columns'
import { getAllReceivers } from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/receivers'
import { Card, CardContent } from '@/modules/common/components/card/card'
import getSectionInfo from '@/utils/helpers/get-path-info'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

export const metadata: Metadata = {
  title: 'Destinatarios',
  description: 'Registra las personas que reciben los despachos',
}
export default async function Page() {
  const receiversData = await getAllReceivers()
  const path = getSectionInfo({
    sectionName: SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
    property: 'path',
  })
  return (
    <>
      <>
        <PageHeader>
          <HeaderLeftSide>
            <PageHeaderTitle>
              <UserSquare2 size={24} />
              Destinatarios
            </PageHeaderTitle>
            <PageHeaderDescription>
              Registra las personas que reciben los despachos
            </PageHeaderDescription>
          </HeaderLeftSide>
          <HeaderRightSide>
            <Link
              href={`${path}/agregar`}
              className={buttonVariants({ variant: 'default' })}
            >
              <UserSquare2 className="mr-2 h-4 w-4" />
              Agregar Destinatario
            </Link>
          </HeaderRightSide>
        </PageHeader>
        <PageContent>
          <Card>
            <CardContent>
              <DataTable columns={columns} data={receiversData} />
            </CardContent>
          </Card>
        </PageContent>
      </>
    </>
  )
}
