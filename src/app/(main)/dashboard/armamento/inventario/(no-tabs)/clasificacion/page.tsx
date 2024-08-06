import ClassificationsForm from '@/app/(main)/dashboard/components/forms/classification-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Clasificación"
      backLink="/dashboard/armamento/inventario"
    >
      <ClassificationsForm />
    </PageForm>
  )
}
