import ItemsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/items-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page() {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Crear Renglón</PageHeaderTitle>
      </PageHeader>
      <ItemsForm />
    </>
  )
}
