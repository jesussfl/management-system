import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { Button } from '@/modules/common/components/button'
import { FileDown, User2 } from 'lucide-react'
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

import { RolesTable } from '@/modules/usuarios/components/roles-table'
import { PermissionsTable } from '@/modules/usuarios/components/permissions-table'

import ModalForm from '@/modules/common/components/modal-form'
import RolesForm from '@/modules/usuarios/components/roles-form'
import PermissionsForm from '@/modules/usuarios/components/permissions-form'

import { getAllUsers } from '@/lib/actions/users'
import { getAllRoles } from '@/lib/actions/roles'
import { getAllPermissions } from '@/lib/actions/permissions'
import { validateUserPermissions } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const usersData = await getAllUsers()
  const rolesData = await getAllRoles()
  const permissionsData = await getAllPermissions()

  // const isAuthorized = await validateUserPermissions({
  //   section: SECTION_NAMES.USUARIOS,
  // })

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
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
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
            <div className="flex w-full gap-8 p-3">
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Roles</h4>
                  <ModalForm triggerName="Nuevo rol">
                    <RolesForm permissions={permissionsData} />
                  </ModalForm>
                </div>
                <RolesTable data={rolesData} />
              </div>
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Permisos</h4>
                  <ModalForm triggerName="Nuevo permiso">
                    <PermissionsForm />
                  </ModalForm>
                </div>
                <PermissionsTable data={permissionsData} />
              </div>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
