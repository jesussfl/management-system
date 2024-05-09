import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'
import ComponentsForm from '@/modules/rangos/components/forms/components-form'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Componente</PageHeaderTitle>
      </PageHeader>
      <ComponentsForm />
    </>
  )
}
