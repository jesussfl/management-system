import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus, FileDown, PackagePlus } from 'lucide-react'
import { Metadata } from 'next'
import { RenglonType } from '@/types/types'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import ReceptionsForm from '@/modules/recepciones/components/form/receptions-form'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/lib/actions/items'
import { getAllReceptions } from '@/lib/actions/receptions'
import ModalForm from '@/modules/common/components/modal-form'
import Link from 'next/link'

import { buttonVariants } from '@/modules/common/components/button'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const receptionsData = await getAllReceptions()
  const itemsData = await getAllItems()

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
