import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Button, buttonVariants } from '@/modules/common/components/button'
import { DownloadIcon, FileDown, Plus, User2 } from 'lucide-react'
import { Metadata } from 'next'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from '@/modules/common/components/tabs/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'

import { getAllUsers } from '@/app/(main)/dashboard/usuarios/lib/actions/users'
import { getAllRoles } from '@/app/(main)/dashboard/usuarios/lib/actions/roles'
import { getAllPermissions } from '@/app/(main)/dashboard/usuarios/lib/actions/permissions'
import Link from 'next/link'
import { columns as permissionsColumns } from './components/permissions-table'
import { columns as rolesColumns } from './components/roles-table'
import ModalForm from '@/modules/common/components/modal-form'
import { CredentialsSignupForm } from '@/app/(auth)/components/credentials-signup-form'
import { FaceSignupForm } from '@/app/(auth)/components/face-signup-form'
export const metadata: Metadata = {
  title: 'Usuarios',
  description: 'Administra los usuarios registrados y sus roles',
}

export default async function Page() {
  const usersData = await getAllUsers()
  const rolesData = await getAllRoles()
  const permissionsData = await getAllPermissions()

  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <User2 size={24} />
            Usuarios
          </PageHeaderTitle>
          <PageHeaderDescription>
            Administra los usuarios registrados y sus roles
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/usuarios/agregar-usuario"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="users">
        <TabsList className="mx-5">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <PageContent>
            <DataTable columns={columns} data={usersData} />
          </PageContent>
        </TabsContent>
        <TabsContent value="roles">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Permisos</CardTitle>
                  <Link
                    href="/dashboard/usuarios/permiso"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Permiso
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={permissionsColumns}
                    data={permissionsData}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Roles</CardTitle>
                  <Link
                    href="/dashboard/usuarios/rol"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Rol
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={rolesColumns} data={rolesData} />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
