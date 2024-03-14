import ClassificationsForm from '@/modules/inventario/components/classification-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Clasificación</PageHeaderTitle>
      </PageHeader>
      <ClassificationsForm />
    </>
  )
}
