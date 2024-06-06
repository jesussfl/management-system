import ItemsForm from '@/app/(main)/dashboard/armamento/inventario/components/items-form'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page() {
  return (
    <PageForm title="Crear Renglón" backLink="/dashboard/armamento/inventario">
      <ItemsForm />
    </PageForm>
  )
}
