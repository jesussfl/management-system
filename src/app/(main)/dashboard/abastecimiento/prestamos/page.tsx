import { buttonVariants } from '@/modules/common/components/button'
import { Plus, PackageMinus } from 'lucide-react'
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

import { columns } from './columns'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/modules/common/components/card/card'
import { Overview } from '@/modules/common/components/overview/overview'
import { getAllLoans } from '@/lib/actions/loan'

export const metadata: Metadata = {
  title: 'Prestamos',
  description: 'Desde aquí puedes administrar los prestamos del inventario',
}
export default async function Page() {
  const loansData = await getAllLoans('Abastecimiento')
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackageMinus size={24} />
            Préstamos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las salidas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/abastecimiento/prestamos/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Préstamo
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <Card>
          <CardContent>
            <DataTable columns={columns} data={loansData} />
          </CardContent>
        </Card>
      </PageContent>
    </>
  )
}
