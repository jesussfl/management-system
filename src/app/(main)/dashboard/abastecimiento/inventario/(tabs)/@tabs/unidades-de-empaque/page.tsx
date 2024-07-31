import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import { PageContent } from '@/modules/layout/templates/page'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'
import { getAllPackagingUnits } from '@/app/(main)/dashboard/lib/actions/packaging-units'
import { columns as packagingUnitsColumns } from '@/app/(main)/dashboard/abastecimiento/inventario/components/columns/packaging-units-columns'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

export default async function Page() {
  const packagingUnitsData = await getAllPackagingUnits()

  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-xl">
            Lista de Unidades de Empaque
          </CardTitle>

          <Link
            href="/dashboard/abastecimiento/inventario/unidad-empaque"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Unidad de Empaque
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={packagingUnitsColumns}
            data={packagingUnitsData}
          />
        </CardContent>
      </Card>
    </PageContent>
  )
}
