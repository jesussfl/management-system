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

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const receptionsData = await getAllReceptions()
  console.log(receptionsData)
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Recepciones
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona las entradas del inventario
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link
            href="/dashboard/abastecimiento/recepciones/agregar"
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
