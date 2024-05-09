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
import ProfessionalsForm from './form'
import getSectionInfo from '@/utils/helpers/get-path-info'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'

export const metadata: Metadata = {
  title: 'Profesionales',
  description: 'Los profesionales son las personas que aprueban los despachos',
}

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href={
              getSectionInfo({
                sectionName: SECTION_NAMES.PROFESIONALES,
                property: 'path',
              }) || '/dashboard/profesionales'
            }
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Agrega un profesional
            </PageHeaderTitle>
            <PageHeaderDescription>
              Los profesionales son las personas que aprueban los despachos
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <ProfessionalsForm />
      </PageContent>
    </>
  )
}
