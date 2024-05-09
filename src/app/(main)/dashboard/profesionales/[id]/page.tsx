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
import { getProfessionalById } from '../lib/actions/professionals'
import ProfessionalsForm from '../agregar/form'

export const metadata: Metadata = {
  title: 'Editar Profesionales',
  description: 'Los profesionales son las personas que aprueban los despachos',
}

export default async function Page({ params }: { params: { id: string } }) {
  const professional = await getProfessionalById(Number(params.id))
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/profesionales"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar profesional
            </PageHeaderTitle>
            <PageHeaderDescription>
              Los profesionales son las personas que aprueban los despachos
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ProfessionalsForm defaultValues={professional} />
      </PageContent>
    </>
  )
}
