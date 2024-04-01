import ItemsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/items-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import CategoriesForm from '@/modules/rangos/components/forms/categories-form'
import ComponentsForm from '@/modules/rangos/components/forms/components-form'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Componente</PageHeaderTitle>
      </PageHeader>
      <ComponentsForm />
    </>
  )
}
