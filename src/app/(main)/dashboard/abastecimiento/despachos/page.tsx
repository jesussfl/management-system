import { Button, buttonVariants } from '@/modules/common/components/button'
import { Plus, FileDown, PackageMinus, PackagePlus } from 'lucide-react'
import { Metadata } from 'next'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'
import { DataTable } from '@/modules/common/components/table/data-table'
import { getAllDispatches } from '@/app/(main)/dashboard/abastecimiento/despachos/lib/actions/dispatches'
import { columns } from './columns'
import Link from 'next/link'

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
            <PackagePlus size={24} />
            Despachos
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las salidas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link
            href="/dashboard/abastecimiento/despachos/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Despacho
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={dispatchesData} />
      </PageContent>
    </>
  )
}
