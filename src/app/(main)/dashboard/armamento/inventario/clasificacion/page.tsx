import PageForm from '@/modules/layout/components/page-form'
import ClassificationsForm from '../../../components/classification-form'

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
