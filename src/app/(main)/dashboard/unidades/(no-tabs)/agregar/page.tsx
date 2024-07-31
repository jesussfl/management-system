import UnitsForm from '../../components/forms/unit-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm title="Agregar Unidad" backLink="/dashboard/unidades">
      <UnitsForm />
    </PageForm>
  )
}
