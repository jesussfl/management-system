import {
  getCategoryById,
  getGradeById,
} from '@/app/(main)/dashboard/rangos/lib/actions/ranks'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import CategoriesForm from '@/modules/rangos/components/forms/categories-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const categoryData = await getCategoryById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Grado</PageHeaderTitle>
      </PageHeader>
      <CategoriesForm defaultValues={categoryData} />
    </>
  )
}
