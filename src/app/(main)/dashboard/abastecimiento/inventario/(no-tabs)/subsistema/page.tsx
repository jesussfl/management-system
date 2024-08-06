import PageForm from '@/modules/layout/components/page-form'
import SubsystemForm from '../../../../components/forms/subsystem-form'

export default async function Page() {
  return (
    <PageForm
      title="Crear Subsistema"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <SubsystemForm />
    </PageForm>
  )
}
