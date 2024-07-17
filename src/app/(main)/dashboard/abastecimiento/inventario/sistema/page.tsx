import ItemsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/items-form'
import PageForm from '@/modules/layout/components/page-form'
import SubsystemForm from '../components/forms/subsystem-form'
import SystemForm from '../components/forms/system-form'

export default async function Page() {
  return (
    <PageForm
      title="Crear Sistema"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <SystemForm />
    </PageForm>
  )
}
