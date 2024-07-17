import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Plus, PackagePlus, PackageCheck } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import {
  deleteMultipleReceptions,
  getAllReceptions,
} from '@/app/(main)/dashboard/abastecimiento/recepciones/lib/actions/receptions'
import Link from 'next/link'

import { buttonVariants } from '@/modules/common/components/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const receptionsData = await getAllReceptions()
  const deletedReceptionsData = await getAllReceptions(false)
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackageCheck size={24} />
            Recepciones
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las entradas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/abastecimiento/recepciones/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Recepción
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <Tabs defaultValue="receptions">
        <TabsList className="mx-5">
          <TabsTrigger value="receptions">Recepciones</TabsTrigger>
          <TabsTrigger value="deleted">Eliminadas</TabsTrigger>
        </TabsList>
        <TabsContent value="receptions">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">Lista de Recepciones</CardTitle>
              </CardHeader>

              <CardContent>
                <DataTable
                  columns={columns}
                  data={receptionsData}
                  isMultipleDeleteEnabled
                  multipleDeleteAction={deleteMultipleReceptions}
                />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="deleted">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-md">
                  Lista de Recepciones Eliminadas
                </CardTitle>
              </CardHeader>

              <CardContent>
                <DataTable
                  columns={columns}
                  data={deletedReceptionsData}
                  isMultipleDeleteEnabled
                  multipleDeleteAction={deleteMultipleReceptions}
                />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
