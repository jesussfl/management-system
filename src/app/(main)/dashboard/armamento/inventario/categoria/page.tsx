import CategoriesForm from '@/app/(main)/dashboard/armamento/inventario/components/forms/categories-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm
      title="Agregar Categoría"
      backLink="/dashboard/armamento/inventario"
    >
      <CategoriesForm />
    </PageForm>
  )
}
