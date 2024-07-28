import PageForm from '@/modules/layout/components/page-form'
import PackagingUnitsForm from '../../../components/packaging-units-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Unidad de Empaque"
      backLink="/dashboard/armamento/inventario"
    >
      <PackagingUnitsForm />
    </PageForm>
  )
}
