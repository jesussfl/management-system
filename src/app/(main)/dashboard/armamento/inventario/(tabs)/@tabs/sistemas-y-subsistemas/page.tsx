import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import { columns as subsystemColumns } from '@/app/(main)/dashboard/armamento/inventario/components/columns/subsystem-columns'
import { columns as systemColumns } from '@/app/(main)/dashboard/armamento/inventario/components/columns/system-columns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { getAllSystems } from '@/lib/actions/systems'
import { getAllSubsystems } from '@/lib/actions/subsystems'

export const metadata: Metadata = {
  title: 'Sistemas y Subsistemas',
  description: 'Desde aquí puedes ver todos los sistemas y subsistemas',
}

export default async function Page() {
  const systemsData = await getAllSystems()
  const subsystemsData = await getAllSubsystems()
  return (
    <PageContent>
      <div className="flex w-full gap-8">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Lista de Sistemas</CardTitle>
            <Link
              href="/dashboard/armamento/inventario/sistema"
              className={buttonVariants({ variant: 'secondary' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Sistema
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable columns={systemColumns} data={systemsData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-xl">Lista de Subsistemas</CardTitle>
            <Link
              href="/dashboard/armamento/inventario/subsistema"
              className={buttonVariants({ variant: 'secondary' })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Subsistema
            </Link>
          </CardHeader>
          <CardContent>
            <DataTable columns={subsystemColumns} data={subsystemsData} />
          </CardContent>
        </Card>
      </div>
    </PageContent>
  )
}
