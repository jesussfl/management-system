import { UserSquare2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/basic-tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { columns, guardColumns } from './columns'
import { getAllPersonnel } from '../personal/lib/actions/personnel'
import { getAllGuards } from './lib/actions'
import { TableWithExport } from './table-with-export'

export const metadata: Metadata = {
  title: 'Guardias',
  description: 'Registra guardias',
}
export default async function Page() {
  const personnel = await getAllPersonnel()
  const guards = await getAllGuards()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <UserSquare2 size={24} />
            Guardias
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza y Asigna Guardias
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>
      <Tabs defaultValue="personal">
        <TabsList className="mx-5">
          <TabsTrigger value="personal">Vista Por Personal</TabsTrigger>
          <TabsTrigger value="guards">Vista Por Guardias</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Vista por Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={personnel} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="guards">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Vista por Guardias</CardTitle>
              </CardHeader>
              <CardContent>
                <TableWithExport data={guards} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
