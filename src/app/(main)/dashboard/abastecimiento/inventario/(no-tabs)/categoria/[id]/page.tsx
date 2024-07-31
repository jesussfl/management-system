import { getCategoryById } from '@/lib/actions/categories'
import CategoriesForm from '@/app/(main)/dashboard/components/categories-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const categoryData = await getCategoryById(Number(id))
  return (
    <PageForm
      title="Editar Categoría"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <CategoriesForm defaultValues={categoryData} />
    </PageForm>
  )
}
