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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

export const metadata: Metadata = {
  title: 'Destinatarios',
  description: 'Registra las personas que reciben los despachos',
}
export default async function Page() {
  const receiversData = await getAllReceivers()
  const deletedReceivers = await getAllReceivers(true)
  const path = getSectionInfo({
    sectionName: SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
    property: 'path',
  })
  return (
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
      <Tabs>
        <TabsList className="mx-5" defaultValue="Activos">
          <TabsTrigger value="Activos">Activos</TabsTrigger>
          <TabsTrigger value="Eliminados">Eliminados</TabsTrigger>
        </TabsList>
        <TabsContent value="Activos">
          <PageContent>
            <Card>
              <CardContent>
                <DataTable columns={columns} data={receiversData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>

        <TabsContent value="Eliminados">
          <PageContent>
            <Card>
              <CardContent>
                <DataTable columns={columns} data={deletedReceivers} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
