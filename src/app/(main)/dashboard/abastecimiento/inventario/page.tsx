import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'

import { Metadata } from 'next'

import ModalForm from '@/modules/common/components/modal-form'
import { Boxes } from 'lucide-react'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import { auth } from '@/auth'
import RowItemForm from '@/modules/inventario/components/rowitem-form'
import { Roles_Permisos } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card',
  },
]
const SECTION_NAME = 'ARMAMENTO'
async function getData() {
  'use server'
  const data = await prisma.renglones.findMany({
    include: {
      recibimientos: true,
    },
  })
  return data
}
const validateRol = async (permisos: Roles_Permisos[]) => {
  if (permisos.length > 0) {
    // Verificar si alguno de los permisos contiene la cadena "Abastecimiento" en permiso_key
    const hasAbastecimientoPermission = permisos.some((permiso) =>
      permiso.permiso_key.includes(SECTION_NAME)
    )

    if (hasAbastecimientoPermission) {
      // La validación pasa, hay un permiso que contiene "Abastecimiento"
      console.log('El rol tiene permisos de Abastecimiento')
      // Puedes devolver true u otra acción según tus necesidades
      return true
    } else {
      // La validación no pasa, no hay permisos que contengan "Abastecimiento"
      console.log('El rol no tiene permisos de Abastecimiento')
      // Puedes devolver false u otra acción según tus necesidades
      return false
    }
  } else {
    // El rol no existe
    console.log('El rol no existe')
    // Puedes devolver false u otra acción según tus necesidades
    return false
  }
}
export default async function Page() {
  const session = await auth()
  const permissions = session?.user.rol.permisos
  const isAuthorized = await validateRol(permissions)

  if (!isAuthorized) {
    return null
  }

  const data = await getData()

  return (
    <PageTemplate>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Boxes size={24} />
            Inventario
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona todos los stocks y renglones
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <ModalForm triggerName="Nuevo renglon">
            <RowItemForm />
          </ModalForm>
        </HeaderRightSide>
      </PageHeader>

      <Tabs defaultValue="rowitems">
        <TabsList className="mx-5">
          <TabsTrigger value="rowitems">Renglones</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
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
                <h4 className="font-semibold">Lista de clasificaciones</h4>
                <Table>
                  {/* <TableCaption>
                    Lista de clasificaciones en el inventario
                  </TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Categorías</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">
                          {invoice.invoice}
                        </TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {invoice.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col flex-1 border border-border rounded-sm p-5 gap-5">
                <h4 className="font-semibold">Lista de clasificaciones</h4>
                <Table>
                  {/* <TableCaption>
                    Lista de clasificaciones en el inventario
                  </TableCaption> */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Nombre</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Categorías</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">
                          {invoice.invoice}
                        </TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {invoice.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  )
}
