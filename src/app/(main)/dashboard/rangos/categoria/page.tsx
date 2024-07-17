import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import CategoriesForm from '@/app/(main)/dashboard/rangos/components/forms/categories-form'

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
