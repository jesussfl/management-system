import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import { getReturnById } from '../lib/actions/returns'
import ReturnsForm from '../components/form/returns-form'
import { getAllReceiversToCombobox } from '../../destinatarios/lib/actions/receivers'

export const metadata: Metadata = {
  title: 'Devoluciones',
  description: 'Desde aquí puedes administrar las devoluciones del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems()
  const devolution = await getReturnById(Number(params.id))
  const receiver = await getAllReceiversToCombobox()
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/devoluciones"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Devolución
            </PageHeaderTitle>
            <PageHeaderDescription>
              Las devoluciones serán agregadas al inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ReturnsForm
          renglonesData={itemsData}
          // @ts-ignore
          defaultValues={devolution}
          receivers={receiver}
        />
      </PageContent>
    </>
  )
}
