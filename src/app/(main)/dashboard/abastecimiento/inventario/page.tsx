import { columns } from './columns'
import { Renglon } from '@/utils/types/types'
import { DataTable } from '@/modules/common/components/table/data-table'
import { prisma } from '@/lib/prisma'
import { Button } from '@/modules/common/components/button'
import { Plus } from 'lucide-react'

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
  title: 'Inventario',
  description: 'Desde aquí puedes ver todos tus renglones',
}
type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined
}

export default async function Page({ searchParams }: SearchParamProps) {
  const data = await prisma.renglones.findMany()

  return (
    <main className="flex-1 max-h-full m-12 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-md font-medium">Inventario</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size={'sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Renglón
              </Button>
            </DialogTrigger>
            <DialogContent
              className={'lg:max-w-screen-lg max-h-[94%] overflow-hidden px-0'}
            >
              <DialogHeader className="px-6 pb-4 border-b border-border">
                <DialogTitle>Nuevo Renglón</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo renglón a la base de datos de abastecimiento
                </DialogDescription>
              </DialogHeader>

              <RenglonesForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size={'sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Recibimiento
              </Button>
            </DialogTrigger>
            <DialogContent
              className={'lg:max-w-screen-lg overflow-auto max-h-[90vh]'}
            >
              <DialogHeader>
                <DialogTitle>Nuevo Recibimiento</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo recibimiento a la base de datos de
                  abastecimiento
                </DialogDescription>
              </DialogHeader>
              <RenglonesForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size={'sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Despacho
              </Button>
            </DialogTrigger>
            <DialogContent
              className={'lg:max-w-screen-lg overflow-auto max-h-[90vh]'}
            >
              <DialogHeader>
                <DialogTitle>Nuevo Despacho</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo despacho a la base de datos de abastecimiento
                </DialogDescription>
              </DialogHeader>
              <RenglonesForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </main>
  )
}
