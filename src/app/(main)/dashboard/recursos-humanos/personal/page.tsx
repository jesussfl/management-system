import { buttonVariants } from '@/modules/common/components/button'
import { Plus, UserSquare2 } from 'lucide-react'
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

import { getAllPersonnel } from './lib/actions/personnel'

export const metadata: Metadata = {
  title: 'Personal',
  description: 'Registra las personas que trabajan en el CESERLODAI',
}
export default async function Page() {
  const personnel = await getAllPersonnel()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <UserSquare2 size={24} />
            Personal Registrado
          </PageHeaderTitle>
          <PageHeaderDescription>
            Registra las personas que trabajan en el CESERLODAI
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/recursos-humanos/personal/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Personal
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={personnel} />
      </PageContent>
    </>
  )
}
