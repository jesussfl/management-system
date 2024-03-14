import { getClassificationById } from '@/lib/actions/classifications'
import ClassificationsForm from '@/modules/inventario/components/classification-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const classificationData = await getClassificationById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Clasificación</PageHeaderTitle>
      </PageHeader>
      <ClassificationsForm defaultValues={classificationData} />
    </>
  )
}
