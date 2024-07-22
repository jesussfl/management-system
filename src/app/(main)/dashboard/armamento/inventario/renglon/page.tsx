import PageForm from '@/modules/layout/components/page-form'
import ItemsForm from '../components/forms/items-form'

export default async function Page() {
  return (
    <PageForm title="Crear Renglón" backLink="/dashboard/armamento/inventario">
      <ItemsForm />
    </PageForm>
  )
}
