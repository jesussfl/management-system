import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
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
  PageTemplate,
} from '@/modules/layout/templates/page'
import ModalForm from '@/modules/common/components/modal-form'
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from '@/modules/common/components/tabs/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import { RolesTable } from '@/modules/usuarios/components/roles-table'
import RolesForm from '@/modules/usuarios/components/roles-form'
import PermissionsForm from '@/modules/usuarios/components/permissions-form'
import { PermissionsTable } from '@/modules/usuarios/components/permissions-table'
export const metadata: Metadata = {
  title: 'Recibimientos',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const data = await prisma.usuario.findMany()
  const roles = await prisma.rol.findMany()
  const permissions = await prisma.permiso.findMany()
  return (
    <PageTemplate>
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
      <Tabs defaultValue="rowitems">
        <TabsList className="mx-5">
          <TabsTrigger value="rowitems">Usuarios</TabsTrigger>
          <TabsTrigger value="categories">Roles y Permisos</TabsTrigger>
        </TabsList>
        <TabsContent value="rowitems">
          <PageContent>
            <DataTable columns={columns} data={data} />
          </PageContent>
        </TabsContent>
        <TabsContent value="categories">
          <PageContent>
            <div className="flex w-full gap-8 p-3">
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Roles</h4>
                  <ModalForm triggerName="Nuevo rol">
                    <RolesForm />
                  </ModalForm>
                </div>
                <RolesTable data={roles} />
              </div>
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <div className="flex justify-between">
                  <h4 className="font-semibold">Lista de Permisos</h4>
                  <ModalForm triggerName="Nuevo permiso">
                    <PermissionsForm />
                  </ModalForm>
                </div>
                <PermissionsTable data={permissions} />
              </div>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}
