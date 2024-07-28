import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Plus, PackagePlus } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import Link from 'next/link'
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
import { buttonVariants } from '@/modules/common/components/button'
import { supplierColumns } from './components/columns/supplier-columns'
import { getAllSuppliers } from './lib/actions/suppliers'
import { getAllOrders } from '../../lib/actions/order'

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Gestiona los pedidos del inventario de armamento',
}

export default async function Page() {
  const orders = await getAllOrders('Armamento')
  const suppliers = await getAllSuppliers()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Pedidos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona los pedidos del inventario de armamento
          </PageHeaderDescription>
        </HeaderLeftSide>
      </PageHeader>

      <Tabs defaultValue="pedidos">
        <TabsList className="mx-5">
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Pedidos</CardTitle>
                <Link
                  href="/dashboard/armamento/pedidos/agregar"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Pedido
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={orders} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="proveedores">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Proveedores</CardTitle>
                <Link
                  href="/dashboard/armamento/pedidos/proveedor/nuevo"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Proveedor
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={supplierColumns} data={suppliers} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
