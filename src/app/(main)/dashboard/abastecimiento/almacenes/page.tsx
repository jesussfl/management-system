import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import { Card, CardContent } from '@/modules/common/components/card/card'
import { Boxes, PackagePlus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { getAllWarehouses } from './lib/actions/warehouse'
import getSectionInfo from '@/utils/helpers/get-path-info'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

export const metadata: Metadata = {
  title: 'Almacenes',
  description: 'Desde aquí puedes ver todos los almacenes',
}

export default async function Page() {
  const warehousesData = await getAllWarehouses()
  const path = getSectionInfo({
    sectionName: SECTION_NAMES.ALMACENES,
    property: 'path',
  })
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Boxes size={24} />
            Almacenes
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza los almacenes disponibles del CESERLODAI
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href={`${path}/almacen`}
            className={buttonVariants({ variant: 'default' })}
          >
            <PackagePlus className="mr-2 h-4 w-4" />
            Agregar Almacén
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="almacenes">
        <TabsList className="mx-5">
          <TabsTrigger value="almacenes">Almacenes</TabsTrigger>
        </TabsList>
        <TabsContent value="almacenes">
          <PageContent>
            <Card>
              <CardContent>
                <DataTable columns={columns} data={warehousesData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
