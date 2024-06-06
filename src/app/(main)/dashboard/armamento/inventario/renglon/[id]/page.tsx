import { getItemById } from '@/app/(main)/dashboard/armamento/inventario/lib/actions/items'
import ItemsForm from '@/app/(main)/dashboard/armamento/inventario/components/items-form'

import PageForm from '@/modules/layout/components/page-form'

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
