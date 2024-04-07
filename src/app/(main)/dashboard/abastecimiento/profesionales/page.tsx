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
import { getAllReceivers } from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/receivers'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import {
  getAllCategories,
  getAllComponents,
  getAllGrades,
} from '@/app/(main)/dashboard/abastecimiento/destinatarios/lib/actions/ranks'
import { columns as categoryColumns } from '@/modules/rangos/components/columns/category-columns'
import { columns as gradeColumns } from '@/modules/rangos/components/columns/grade-columns'
import { columns as componentColumns } from '@/modules/rangos/components/columns/component-columns'
import { getAllProfessionals } from './lib/actions/professionals'

export const metadata: Metadata = {
  title: 'Profesionales',
  description: 'Registra las personas que aprueban los despachos',
}
export default async function Page() {
  const professionals = await getAllProfessionals()
  const gradesData = await getAllGrades()
  const componentsData = await getAllComponents()
  const categoriesData = await getAllCategories()
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
            href="/dashboard/abastecimiento/profesionales/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Profesional
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="profesionales">
        <TabsList className="mx-5">
          <TabsTrigger value="profesionales">Profesionales</TabsTrigger>
          <TabsTrigger value="componentes">Componentes</TabsTrigger>
          <TabsTrigger value="grados">Grados</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
        </TabsList>
        <TabsContent value="profesionales">
          <PageContent>
            <DataTable columns={columns} data={professionals} />
          </PageContent>
        </TabsContent>
        <TabsContent value="categorias">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Categorias Militares</CardTitle>
                <Link
                  href="/dashboard/abastecimiento/destinatarios/categoria"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Categoría
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={categoryColumns} data={categoriesData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="grados">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Grados Militares</CardTitle>
                <Link
                  href="/dashboard/abastecimiento/destinatarios/grado"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Grado
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={gradeColumns} data={gradesData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="componentes">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Lista de Componentes Militares</CardTitle>
                <Link
                  href="/dashboard/abastecimiento/destinatarios/componente"
                  className={buttonVariants({ variant: 'default' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Componente
                </Link>
              </CardHeader>
              <CardContent>
                <DataTable columns={componentColumns} data={componentsData} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
