import PageForm from '@/modules/layout/components/page-form'
import SystemForm from '../../../../components/system-form'

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
