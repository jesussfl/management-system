import PageForm from '@/modules/layout/components/page-form'
import ItemsForm from '../../../../components/item-form'

export default async function Page() {
  return (
    <PageForm title="Crear Renglón" backLink="/dashboard/armamento/inventario">
      <ItemsForm section="Armamento" />
    </PageForm>
  )
}
