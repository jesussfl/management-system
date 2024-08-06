import PackagingUnitsForm from '@/app/(main)/dashboard/components/forms/packaging-units-form'
import PageForm from '@/modules/layout/components/page-form'

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
