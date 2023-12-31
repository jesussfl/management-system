import { prisma } from '@/lib/prisma'
import { Renglon } from '@/utils/types/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import RowItemForm from '@/modules/inventario/components/rowitem-form'
import { Button } from '@/modules/common/components/button'
import { Edit } from 'lucide-react'

type Props = {
  params: { handle: string }
}
export default async function Page({ params }: Props) {
  const data = (await prisma.renglones.findUnique({
    where: {
      id: Number(params.handle),
    },
  })) as Renglon
  return (
    <div className="flex">
      <div className="flex-1 max-h-full m-12 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm">
        <h1>{data?.nombre}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size={'sm'}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Renglón
            </Button>
          </DialogTrigger>

          <DialogContent
            className={'lg:max-w-screen-lg overflow-auto max-h-[90vh]'}
          >
            <DialogHeader>
              <DialogTitle>Editar Renglón</DialogTitle>
              <DialogDescription>
                Editar el renglón en la base de datos de abastecimiento
              </DialogDescription>
            </DialogHeader>
            <RowItemForm defaultValues={data} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 max-h-full m-12 overflow-hidden overflow-y-auto bg-background p-5 border border-border rounded-sm"></div>
    </div>
  )
}
