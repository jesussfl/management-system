import { columns } from './columns'

import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RowItemForm from '@/modules/inventario/components/rowitem-form'
export const metadata: Metadata = {
  title: 'Renglones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const data = await prisma.renglones.findMany()

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-md font-medium">Renglones</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size={'sm'}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Renglón
            </Button>
          </DialogTrigger>

          <DialogContent
            className={'lg:max-w-screen-lg overflow-auto max-h-[90vh]'}
          >
            <DialogHeader>
              <DialogTitle>Nuevo Renglón</DialogTitle>
              <DialogDescription>
                Agrega un nuevo renglón a la base de datos de abastecimiento
              </DialogDescription>
            </DialogHeader>
            <RowItemForm close={() => {}} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </>
  )
}
