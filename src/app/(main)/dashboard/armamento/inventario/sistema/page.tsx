import ItemsForm from '@/app/(main)/dashboard/armamento/inventario/components/items-form'
import PageForm from '@/modules/layout/components/page-form'
import SubsystemForm from '../components/subsystem-form'
import SystemForm from '../components/system-form'

export default async function Page() {
  return (
    <PageForm title="Crear Sistema" backLink="/dashboard/armamento/inventario">
      <SystemForm />
    </PageForm>
  )
}
