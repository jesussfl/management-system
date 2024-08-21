import { Metadata } from 'next'
import LoansForm from '@/app/(main)/dashboard/components/forms/loan-form/loans-form'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/lib/actions/item'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackageMinus } from 'lucide-react'
import Link from 'next/link'
import { getAllReceiversToCombobox } from '../../destinatarios/lib/actions/receivers'
import { getAllProfessionalsToCombobox } from '../../../profesionales/lib/actions/professionals'
import { getLoanById } from '@/lib/actions/loan'

export const metadata: Metadata = {
  title: 'Prestamos',
  description: 'Desde aquí puedes administrar las salidas del inventario',
}

export default async function Page({ params }: { params: { id: string } }) {
  const itemsData = await getAllItems(true, 'Abastecimiento')
  const loan = await getLoanById(Number(params.id))
  const receivers = await getAllReceiversToCombobox('Abastecimiento')
  const professionals = await getAllProfessionalsToCombobox()
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/prestamos"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackageMinus size={24} />
              Editar prestamo
            </PageHeaderTitle>
            <PageHeaderDescription>
              Los prestamos serán descontados del inventario
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className="space-y-4 pt-5 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <LoansForm
          servicio="Abastecimiento"
          renglonesData={itemsData}
          defaultValues={loan}
          receivers={receivers}
          professionals={professionals}
          id={Number(params.id)}
        />
      </PageContent>
    </>
  )
}
