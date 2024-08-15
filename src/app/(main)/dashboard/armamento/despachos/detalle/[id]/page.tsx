import { DispatchedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'
import { getDispatchById } from '@/lib/actions/dispatch'
import PageForm from '@/modules/layout/components/page-form'

export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getDispatchById(Number(id))
  const renglones = reception?.renglones

  return (
    <PageForm
      title="Ver detalle de despachos realizados"
      backLink="/dashboard/armamento/despachos"
    >
      {renglones.map((renglon, index) => (
        <DispatchedItemDetails key={index} data={renglon} />
      ))}
    </PageForm>
  )
}
