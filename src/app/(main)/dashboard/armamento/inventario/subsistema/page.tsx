import PageForm from '@/modules/layout/components/page-form'
import SubsystemForm from '../components/subsystem-form'

export default async function Page() {
  return (
    <PageForm
      title="Crear Subsistema"
      backLink="/dashboard/armamento/inventario"
    >
      <SubsystemForm />
    </PageForm>
  )
}
