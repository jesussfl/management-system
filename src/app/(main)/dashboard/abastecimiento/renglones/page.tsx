import { columns } from './columns'

import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button/button'
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
import RenglonesForm from '@/modules/renglones/components/renglones-form'
export const metadata: Metadata = {
  title: 'Renglones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}

export default async function Page() {
  const data = await prisma.renglones.findMany()

  return (
    <main className="flex-1 max-h-full m-12 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-md font-medium">Renglones</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size={'sm'}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Renglón
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
            <RenglonesForm />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </main>
  )
}
