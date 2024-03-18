import { getGradeById } from '@/lib/actions/ranks'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import GradesForm from '@/modules/rangos/components/forms/grades-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const gradeData = await getGradeById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar Grado</PageHeaderTitle>
      </PageHeader>
      <GradesForm defaultValues={gradeData} />
    </>
  )
}
