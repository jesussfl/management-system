import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { PackagePlus } from 'lucide-react'
import { BackLinkButton } from '@/app/(auth)/components/back-button'
import SuppliersForm from '../../../(tabs)/components/forms/suppliers-form'

export const metadata: Metadata = {
  title: 'Agregar proveedor',
  description: 'Desde aquí puedes agregar un nuevo proveedor',
}

export default async function Page() {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-8">
          <BackLinkButton label="Volver" variant="outline" />

          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Crear Proveedor
            </PageHeaderTitle>
            <PageHeaderDescription>
              Registra un nuevo proveedor para la gestión de pedidos
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <SuppliersForm />
      </PageContent>
    </>
  )
}
