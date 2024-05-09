import { getComponentById } from '@/app/(main)/dashboard/rangos/lib/actions/ranks'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import ComponentsForm from '@/modules/rangos/components/forms/components-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const componentData = await getComponentById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Componente</PageHeaderTitle>
      </PageHeader>
      <ComponentsForm defaultValues={componentData} />
    </>
  )
}
