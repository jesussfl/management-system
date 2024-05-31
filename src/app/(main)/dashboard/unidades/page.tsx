import { Button, buttonVariants } from '@/modules/common/components/button'
import { Plus, FileDown, UserSquare2 } from 'lucide-react'
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

import { columns as zodiColumns } from '@/app/(main)/dashboard/unidades/components/columns/zodi-columns'
import { columns as rediColumns } from '@/app/(main)/dashboard/unidades/components/columns/redi-columns'
import { getAllUnits } from './lib/actions/units'
import { getAllRedis } from './lib/actions/redis'
import { getAllZodis } from './lib/actions/zodis'

export const metadata: Metadata = {
  title: 'Unidades',
  description: 'Registra las ubicaciones militares',
}
export default async function Page() {
  const unitsData = await getAllUnits()
  const zodisData = await getAllZodis()
  const redisData = await getAllRedis()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <UserSquare2 size={24} />
            Unidades
          </PageHeaderTitle>
          <PageHeaderDescription>
            Registra las ubicaciones militares
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/unidades/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Unidad
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="unidades">
        <TabsList className="mx-5">
          <TabsTrigger value="redis">Redis</TabsTrigger>
          <TabsTrigger value="zodis">Zodis</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
        </TabsList>
        <TabsContent value="redis">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Redis</CardTitle>
                <Link
                  href="/dashboard/unidades/redi"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Redi
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={rediColumns} data={redisData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="zodis">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Zodis</CardTitle>
                <Link
                  href="/dashboard/unidades/zodi"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Zodi
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={zodiColumns} data={zodisData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="unidades">
          <PageContent>
            <DataTable columns={columns} data={unitsData} />
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
