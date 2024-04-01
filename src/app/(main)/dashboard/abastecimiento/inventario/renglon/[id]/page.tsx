import { getItemById } from '@/lib/actions/items'
import ItemsForm from '@/app/(main)/dashboard/abastecimiento/inventario/components/items-form'

import { PageHeader, PageHeaderTitle } from '@/modules/layout/templates/page'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const itemData = await getItemById(Number(id))
  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Editar renglón</PageHeaderTitle>
      </PageHeader>
      <ItemsForm defaultValues={itemData} />
    </>
  )
}
