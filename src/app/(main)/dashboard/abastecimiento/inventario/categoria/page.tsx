import CategoriesForm from '@/modules/inventario/components/categories-form'
import ItemsForm from '@/modules/inventario/components/items-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Categoría</PageHeaderTitle>
      </PageHeader>
      <CategoriesForm />
    </>
  )
}
