import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Plus, PackageCheck } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import Link from 'next/link'

import { buttonVariants } from '@/modules/common/components/button'
import { getAllReceptions } from '@/lib/actions/reception'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const receptionsData = await getAllReceptions(false, 'Armamento')
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
            href="/dashboard/armamento/recepciones/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Recepción
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={receptionsData} />
      </PageContent>
    </>
  )
}
