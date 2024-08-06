import PageForm from '@/modules/layout/components/page-form'
import { getReceptionById } from '@/lib/actions/reception'
import { ReceivedItemDetails } from '@/app/(main)/dashboard/components/received-item-details/received-item-details'
export default async function Page({
  params: { id },
}: {
  params: { id: string }
}) {
  const reception = await getReceptionById(Number(id))
  const renglones = reception?.renglones

  return (
    <PageForm
      title="Ver detalle de renglones recibidos"
      backLink="/dashboard/armamento/inventario"
    >
      {renglones.map((renglon) => (
        <ReceivedItemDetails key={renglon.id} data={renglon} />
      ))}
    </PageForm>
  )
}
