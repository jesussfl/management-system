import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { buttonVariants } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import { PageContent } from '@/modules/layout/templates/page'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { getAllUsers } from '@/app/(main)/dashboard/usuarios/lib/actions/users'
import Link from 'next/link'
export const metadata: Metadata = {
  title: 'Usuarios',
  description: 'Administra los usuarios registrados y sus roles',
}

export default async function Page() {
  const usersData = await getAllUsers()

  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-xl">Lista de usuarios</CardTitle>
          <Link
            href="/dashboard/usuarios/agregar-usuario"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Link>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={usersData}
            isStatusEnabled={false}
          />
        </CardContent>
      </Card>
    </PageContent>
  )
}
