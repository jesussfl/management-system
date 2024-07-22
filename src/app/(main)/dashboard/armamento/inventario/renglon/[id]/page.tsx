import { getItemById } from '@/app/(main)/dashboard/armamento/inventario/lib/actions/items'

import PageForm from '@/modules/layout/components/page-form'
import ItemsForm from '../../components/forms/items-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const itemData = await getItemById(Number(id))
  return (
    <PageForm title="Editar Renglón" backLink="/dashboard/armamento/inventario">
      <ItemsForm defaultValues={itemData} />
    </PageForm>
  )
}
