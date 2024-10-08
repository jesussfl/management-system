import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { buttonVariants } from '@/modules/common/components/button'
import { getAllOrders } from '@/lib/actions/order'

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Gestiona los pedidos del inventario de abastecimiento',
}

export default async function Page() {
  const orders = await getAllOrders('Abastecimiento')
  return (
    <>
      <PageContent>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Lista de Pedidos</CardTitle>
            <Link
              href="/dashboard/abastecimiento/pedidos/agregar"
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
    </>
  )
}
