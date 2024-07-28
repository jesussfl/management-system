import ItemsForm from '@/app/(main)/dashboard/components/item-form'
import { getItemById } from '@/app/(main)/dashboard/lib/actions/item'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const itemData = await getItemById(Number(id))
  return (
    <PageForm title="Editar Renglón" backLink="/dashboard/armamento/inventario">
      <ItemsForm section="Armamento" defaultValues={itemData} />
    </PageForm>
  )
}
