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
import {
  deleteMultipleDispatches,
  getAllDispatches,
} from '@/app/(main)/dashboard/armamento/despachos/lib/actions/dispatches'
import { columns } from './columns'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Overview } from '@/modules/common/components/overview/overview'

export const metadata: Metadata = {
  title: 'Despachos',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}
export default async function Page() {
  const dispatchesData = await getAllDispatches()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackageMinus size={24} />
            Despachos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las salidas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/armamento/despachos/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Despacho
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <Card>
          <CardHeader>
            {/* <CardTitle>Lista de Despachos</CardTitle> */}
          </CardHeader>
          <CardContent>
            <Overview servicio="Armamento" />

            <DataTable
              columns={columns}
              data={dispatchesData}
              isMultipleDeleteEnabled
              multipleDeleteAction={deleteMultipleDispatches}
            />
          </CardContent>
        </Card>
      </PageContent>
    </>
  )
}
