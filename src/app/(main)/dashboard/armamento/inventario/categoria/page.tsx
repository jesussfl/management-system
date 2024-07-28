import PageForm from '@/modules/layout/components/page-form'
import CategoriesForm from '../../../components/categories-form'

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
