import { DataTable } from '@/modules/common/components/table/data-table'
import { buttonVariants } from '@/modules/common/components/button'
import { Plus, ShieldEllipsis } from 'lucide-react'
import { Metadata } from 'next'
import { PageContent } from '@/modules/layout/templates/page'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { getAllRoles } from '@/app/(main)/dashboard/usuarios/lib/actions/roles'
import Link from 'next/link'
import { columns as rolesColumns } from '../../../components/roles-table'
import ModalForm from '@/modules/common/components/modal-form'
import ViewPermissionsForm from '../../../components/roles-form/view-permissions-form'
export const metadata: Metadata = {
  title: 'Usuarios',
  description: 'Administra los usuarios registrados y sus roles',
}

export default async function Page() {
  const rolesData = await getAllRoles()

  return (
    <PageContent>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-xl">Lista de Roles</CardTitle>
          <div className="flex gap-2">
            <ModalForm
              triggerIcon={<ShieldEllipsis className="h-4 w-4" />}
              triggerName="Permisos del sistema"
              closeWarning={false}
              triggerVariant="outline"
              triggerSize="sm"
            >
              <div>
                <p className="text-md font-bold m-8">Permisos del sistema</p>
                <ViewPermissionsForm />
              </div>
            </ModalForm>
            <Link
              href="/dashboard/usuarios/rol"
              className={buttonVariants({
                variant: 'default',
                size: 'sm',
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Nuevo Rol
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={rolesColumns} data={rolesData} />
        </CardContent>
      </Card>
    </PageContent>
  )
}
