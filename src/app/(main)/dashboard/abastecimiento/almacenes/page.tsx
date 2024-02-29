import { Button } from '@/modules/common/components/button'
import { Plus, FileDown, PackageMinus } from 'lucide-react'
import { Metadata } from 'next'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'
import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  PageTemplate,
} from '@/modules/layout/templates/page'

export const metadata: Metadata = {
  title: 'Recepciones',
  description: 'Desde aquí puedes administrar la entrada del inventario',
}
export default async function Page() {
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackageMinus size={24} />
            Almacenes
          </PageHeaderTitle>
          <PageHeaderDescription>
            Visualiza los almacenes disponibles del CESERLODAI
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Button variant="outline" size={'sm'}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size={'sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Almacén
              </Button>
            </DialogTrigger>

            <DialogContent
              className={'lg:max-w-screen-xl overflow-y-auto max-h-[90vh] pb-0'}
            ></DialogContent>
          </Dialog>
        </HeaderRightSide>
      </PageHeader>

      <PageContent></PageContent>
    </>
  )
}
