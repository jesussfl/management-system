import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import GradesForm from '@/app/(main)/dashboard/rangos/components/forms/grades-form'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Grado</PageHeaderTitle>
      </PageHeader>
      <GradesForm />
    </>
  )
}
