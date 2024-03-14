import { getCategoryById } from '@/lib/actions/categories'
import CategoriesForm from '@/modules/inventario/components/categories-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const categoryData = await getCategoryById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Categoría</PageHeaderTitle>
      </PageHeader>
      <CategoriesForm defaultValues={categoryData} />
    </>
  )
}
