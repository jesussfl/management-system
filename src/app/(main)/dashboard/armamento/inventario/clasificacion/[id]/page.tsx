import ClassificationsForm from '@/app/(main)/dashboard/components/classification-form'
import { getClassificationById } from '@/app/(main)/dashboard/lib/actions/classifications'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const classificationData = await getClassificationById(Number(id))
  return (
    <PageForm
      title="Editar Clasificación"
      backLink="/dashboard/armamento/inventario"
    >
      <ClassificationsForm defaultValues={classificationData} />
    </PageForm>
  )
}
