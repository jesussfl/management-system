import { Button, buttonVariants } from '@/modules/common/components/button'
import { Plus, FileDown, UserSquare2 } from 'lucide-react'
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
import Link from 'next/link'
import { columns } from './columns'
import { getAllProfessionals } from './lib/actions/professionals'

export const metadata: Metadata = {
  title: 'Profesionales',
  description: 'Registra las personas que aprueban los despachos',
}
export default async function Page() {
  const professionals = await getAllProfessionals()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <UserSquare2 size={24} />
            Profesionales
          </PageHeaderTitle>
          <PageHeaderDescription>
            Registra las personas que aprueban los despachos
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link
            href="/dashboard/profesionales/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Profesional
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={professionals} />
      </PageContent>
    </>
  )
}
