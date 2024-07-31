import { getItemById } from '@/lib/actions/item'

import PageForm from '@/modules/layout/components/page-form'
import ItemsForm from '../../../../../components/item-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const itemData = await getItemById(Number(id))
  return (
    <PageForm
      title="Editar Renglón"
      backLink="/dashboard/abastecimiento/inventario"
    >
      <ItemsForm section="Abastecimiento" defaultValues={itemData} />
    </PageForm>
  )
}
