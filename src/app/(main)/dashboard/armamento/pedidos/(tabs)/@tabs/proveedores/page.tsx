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
import { getAllSuppliers } from '../../lib/actions/suppliers'
import { supplierColumns } from '../../components/columns/supplier-columns'

export const metadata: Metadata = {
  title: 'Pedidos',
  description: 'Gestiona los pedidos del inventario de armamento',
}

export default async function Page() {
  const suppliers = await getAllSuppliers()
  return (
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
  )
}
