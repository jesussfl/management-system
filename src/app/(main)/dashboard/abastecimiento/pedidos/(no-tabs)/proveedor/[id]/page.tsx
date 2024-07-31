import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import { getSupplierById } from '../../../(tabs)/lib/actions/suppliers'
import SuppliersForm from '../../../(tabs)/components/forms/suppliers-form'

export const metadata: Metadata = {
  title: 'Editar Proveedor',
  description: 'Desde aquí puedes editar la información del proveedor',
}

export default async function Page({ params }: { params: { id: string } }) {
  const supplier = await getSupplierById(Number(params.id))

  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/pedidos"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Proveedor
            </PageHeaderTitle>
            <PageHeaderDescription>
              Desde aquí puedes editar la información del proveedor
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <SuppliersForm defaultValues={supplier} />
      </PageContent>
    </>
  )
}
