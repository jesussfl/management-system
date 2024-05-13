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
import GuardsForm from '../agregar/form'
import { getPersonnelByCedula, getPersonnelById } from '../lib/actions'

export const metadata: Metadata = {
  title: 'Editar Guardia',
  description: 'El personal son las personas que trabajan en el CESERLODAI',
}

export default async function Page({ params }: { params: { id: string } }) {
  const personnel = await getPersonnelByCedula(params.id)
  const transformedPersonnel = {
    guardias: personnel.guardias.map((guardia) => ({
      estado: guardia.estado,
      fecha: guardia.fecha,
      ubicacion: guardia.ubicacion,
    })),
  }
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/recursos-humanos/guardias"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Asignar Guardias
            </PageHeaderTitle>
            <PageHeaderDescription>
              Desde aqui puedes asignar guardias
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <GuardsForm defaultValues={transformedPersonnel} cedula={params.id} />
      </PageContent>
    </>
  )
}
