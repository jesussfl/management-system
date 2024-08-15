import PageForm from '@/modules/layout/components/page-form'
import { getDispatchById } from '@/lib/actions/dispatch'
import { DispatchedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const dispatch = await getDispatchById(Number(id))
  const dispatchDetails = dispatch?.renglones

  return (
    <PageForm
      title="Ver detalle de despachos realizados"
      backLink="/dashboard/abastecimiento/despachos"
    >
      {dispatchDetails.map((detail, index) => (
        <DispatchedItemDetails key={index} data={detail} />
      ))}
    </PageForm>
  )
}
