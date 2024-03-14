import PackagingUnitsForm from '@/modules/inventario/components/packaging-units-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Unidad de Empaque</PageHeaderTitle>
      </PageHeader>
      <PackagingUnitsForm />
    </>
  )
}
