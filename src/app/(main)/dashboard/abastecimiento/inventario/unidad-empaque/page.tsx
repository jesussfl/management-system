import PackagingUnitsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/forms/packaging-units-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Unidad de Empaque"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <PackagingUnitsForm />
    </PageForm>
  )
}
