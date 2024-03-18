import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import GradesForm from '@/modules/rangos/components/forms/grades-form'

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
