import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Button } from '@/modules/common/components/button'
import { Plus, FileDown, PackagePlus } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllReceptions } from '@/app/(main)/dashboard/abastecimiento/recepciones/lib/actions/receptions'
import Link from 'next/link'

import { buttonVariants } from '@/modules/common/components/button'
import { getAllReturns } from './lib/actions/returns'

export const metadata: Metadata = {
  title: 'Devoluciones',
  description: 'Gestiona las devoluciones del inventario',
}

export default async function Page() {
  const returnsData = await getAllReturns()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Devoluciones
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las devoluciones del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link
            href="/dashboard/abastecimiento/devoluciones/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Devolución
          </Link>
        </HeaderRightSide>
      </PageHeader>

      <PageContent>
        <DataTable columns={columns} data={returnsData} />
      </PageContent>
    </>
  )
}
